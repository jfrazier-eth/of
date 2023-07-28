interface VideoMediaProps {
  src: string;
  preview: string;
}

export const VideoMedia: React.FC<VideoMediaProps> = ({ src, preview }) => {
  return <video controls poster={preview} src={src} className="w-full h-full object-cover" />;
};
