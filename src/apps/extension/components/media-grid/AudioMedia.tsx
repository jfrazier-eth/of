interface AudioMediaProps {
  src: string;
}

export const AudioMedia: React.FC<AudioMediaProps> = ({ src }) => {
  return (
    <audio controls>
      <source src={src} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};
