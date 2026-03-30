import { useEffect, useState, useRef } from 'react';
import { filesService } from '@/services/api';
import type { FileRecord } from '@/types';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { Upload, Trash2, FileText, Image, File } from 'lucide-react';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getIcon = (mime: string) => {
  if (mime.startsWith('image/')) return <Image className="w-4 h-4 text-info" />;
  if (mime.includes('pdf') || mime.includes('text')) return <FileText className="w-4 h-4 text-destructive" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
};

const Files = () => {
  const [items, setItems] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    filesService.list().then(d => { setItems(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await filesService.upload(file);
    }
    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Arquivos</h1>
          <p className="text-sm text-muted-foreground">{items.length} arquivo(s)</p>
        </div>
        <Button onClick={() => fileRef.current?.click()} size="sm" className="gradient-primary text-primary-foreground" disabled={uploading}>
          <Upload className="w-4 h-4 mr-1" />
          {uploading ? 'Enviando...' : 'Upload'}
        </Button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleUpload} />
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="Nenhum arquivo" description="Faça upload de arquivos para organizá-los por projeto, cliente ou uso pessoal." />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 shadow-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {getIcon(item.mime_type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(item.size)} · {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <button onClick={async () => { await filesService.delete(item.id); load(); }}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Files;
