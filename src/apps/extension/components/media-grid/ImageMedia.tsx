interface ImageMediaProps {
  src: string;
}

export const ImageMedia: React.FC<ImageMediaProps> = ({ src }) => {
  return <img src={src} alt="" />;
};
