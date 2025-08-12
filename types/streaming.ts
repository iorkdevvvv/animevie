// Type definitions for the streaming API response

export interface StreamingLink {
  file?: string;
  type?: string;
  [key: string]: any;
}

export interface Track {
  url: string;
  lang: string;
  [key: string]: any;
}

export interface SkipTimeData {
  start: number;
  end: number;
}

export interface StreamingData {
  id: string;
  type: string;
  link: StreamingLink | null;
  tracks: Track[];
  intro: SkipTimeData | null;
  outro: SkipTimeData | null;
  server: "HD-2" | "HD-3" | null;
}

export interface StreamingApiResponse {
  success: boolean;
  data: StreamingData | null;
  error?: string;
}

export default StreamingApiResponse;
