export interface PartialVideoMetadata {
  id: string;
  videoId: string;
  title: string;
  channel: { id: string; title: string };
  tags: string[];
  language: { name: string; code: string };
  url: string;
  thumbnails: {
    [key in 'default' | 'medium' | 'high' | 'standard' | 'maxres']: {
      width: number;
      height: number;
      url: string;
    };
  };
}
