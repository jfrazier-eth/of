interface GifMediaProps {
  src: string;
}

export const GifMedia: React.FC<GifMediaProps> = ({ src }) => {
  return <img src={src} alt="" />;
};
