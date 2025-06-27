// Base export interface for a YouTube Video resource
export interface YouTubeVideo {
  kind?: string; // Always "youtube#video" for video resources
  etag?: string; // ETag for caching purposes
  id?: string; // The video ID (11 characters, e.g., "dQw4w9WgXcQ")
  snippet?: YouTubeSnippet; // Metadata like title, description, etc.
  contentDetails?: YouTubeContentDetails; // Duration, definition, etc.
  status?: YouTubeStatus; // Upload status, privacy, etc. (added from API docs)
  statistics?: YouTubeStatistics; // View counts, likes, etc.
  player?: YouTubePlayer; // Embeddable player HTML
  topicDetails?: YouTubeTopicDetails; // Topics associated with the video
  recordingDetails?: YouTubeRecordingDetails; // Recording metadata (added from API docs)
  fileDetails?: YouTubeFileDetails; // File metadata (requires authorization, rare)
  processingDetails?: YouTubeProcessingDetails; // Processing status (requires authorization)
  suggestions?: YouTubeSuggestions; // Editing suggestions (requires authorization)
  liveStreamingDetails?: YouTubeLiveStreamingDetails; // Live stream info (for live videos)
}

// Snippet part
export interface YouTubeSnippet {
  publishedAt?: string; // ISO 8601 date, e.g., "2023-01-01T12:00:00Z"
  channelId?: string; // Unique channel ID, e.g., "UC_x5XG1OV2P6uZZ5FSM9Ttw"
  title?: string; // Video title
  description?: string; // Video description
  thumbnails?: {
    default?: YouTubeThumbnail; // 120x90px
    medium?: YouTubeThumbnail; // 320x180px
    high?: YouTubeThumbnail; // 480x360px
    standard?: YouTubeThumbnail; // 640x480px (optional)
    maxres?: YouTubeThumbnail; // 1280x720px (optional, if available)
  };
  channelTitle?: string; // Name of the channel
  tags?: string[]; // Array of keyword tags (optional, uploader-defined)
  categoryId?: string; // Video category ID (see below for values)
  liveBroadcastContent?: "none" | "live" | "upcoming"; // Indicates live status
  defaultLanguage?: string; // ISO 639-1 code, e.g., "en" (optional)
  localized?: {
    title?: string; // Localized title
    description?: string; // Localized description
  };
  defaultAudioLanguage?: string; // ISO 639-1 code, e.g., "en" (optional)
}

// Thumbnail details
export interface YouTubeThumbnail {
  url?: string; // URL of the thumbnail image
  width?: number; // Width in pixels
  height?: number; // Height in pixels
}

// ContentDetails part
export interface YouTubeContentDetails {
  duration?: string; // ISO 8601 duration, e.g., "PT15M33S" (15 min, 33 sec)
  dimension?: "2d" | "3d"; // Video dimension
  definition?: "sd" | "hd"; // Video quality
  caption?: "true" | "false"; // Whether captions are available
  licensedContent?: boolean; // Whether the video is licensed
  contentRating?: Record<string, any>; // Detailed ratings (rarely used, can be specific if needed)
  projection?: "rectangular" | "360"; // Video projection type
  regionRestriction?: {
    allowed?: string[]; // ISO 3166-1 alpha-2 codes where video is allowed
    blocked?: string[]; // ISO 3166-1 alpha-2 codes where video is blocked
  };
}

// Status part (added from API docs)
export interface YouTubeStatus {
  uploadStatus?: "deleted" | "failed" | "processed" | "rejected" | "uploaded"; // Processing status
  privacyStatus?: "private" | "public" | "unlisted"; // Visibility
  license?: "youtube" | "creativeCommon"; // Licensing type
  embeddable?: boolean; // Whether the video can be embedded
  publicStatsViewable?: boolean; // Whether stats are publicly visible
  madeForKids?: boolean; // Whether the video is designated for kids
  selfDeclaredMadeForKids?: boolean; // Uploader's declaration for kids
}

// Statistics part
export interface YouTubeStatistics {
  viewCount?: string; // String in API, e.g., "123456" (parse to number if needed)
  likeCount?: string; // String in API, e.g., "789"
  dislikeCount?: string; // Deprecated since 2021, may not be present
  favoriteCount?: string; // Always "0" now, as favoriting is deprecated
  commentCount?: string; // String in API, e.g., "456" (optional if comments disabled)
}

// Player part
export interface YouTubePlayer {
  embedHtml?: string; // HTML iframe snippet for embedding the video
  embedHeight?: number; // Suggested height for embed (optional)
  embedWidth?: number; // Suggested width for embed (optional)
}

// TopicDetails part
export interface YouTubeTopicDetails {
  topicIds?: string[]; // Deprecated Freebase topic IDs (e.g., "/m/0zgb")
  relevantTopicIds?: string[]; // Freebase topic IDs for relevance
  topicCategories?: string[]; // Wikipedia URLs, e.g., "https://en.wikipedia.org/wiki/Music"
}

// RecordingDetails part (optional, rarely returned)
export interface YouTubeRecordingDetails {
  recordingDate?: string; // ISO 8601 date, e.g., "2023-01-01T12:00:00Z"
}

// FileDetails part (requires authorization, rarely returned)
export interface YouTubeFileDetails {
  fileName?: string; // Original filename
  fileSize?: string; // Size in bytes (as string)
  fileType?: "video" | "audio" | "archive" | "other"; // File type
  container?: string; // e.g., "mp4"
  videoStreams?: Array<{
    widthPixels?: number;
    heightPixels?: number;
    frameRateFps?: number;
    aspectRatio?: number;
    codec?: string; // e.g., "h264"
    bitrateBps?: string; // Bitrate as string
    rotation?: "0" | "90" | "180" | "270"; // Rotation in degrees
  }>;
  audioStreams?: Array<{
    channelCount?: number;
    codec?: string; // e.g., "aac"
    bitrateBps?: string; // Bitrate as string
    sampleRateHz?: number; // e.g., 44100
  }>;
  durationMs?: string; // Duration in milliseconds (as string)
  bitrateBps?: string; // Total bitrate (as string)
  creationTime?: string; // ISO 8601 date of file creation
}

// ProcessingDetails part (requires authorization)
export interface YouTubeProcessingDetails {
  processingStatus?: "failed" | "processing" | "succeeded" | "terminated"; // Current state
  processingProgress?: {
    partsTotal?: string; // Total parts (as string)
    partsProcessed?: string; // Processed parts (as string)
    timeLeftMs?: string; // Estimated time left (as string)
  };
  processingFailureReason?: "uploadFailed" | "transcodeFailed" | "other"; // If failed
  fileDetailsAvailability?: string; // e.g., "available"
  processingIssuesAvailability?: string; // e.g., "available"
  tagSuggestionsAvailability?: string; // e.g., "available"
  editorSuggestionsAvailability?: string; // e.g., "available"
  thumbnailsAvailability?: string; // e.g., "available"
}

// Suggestions part (requires authorization)
export interface YouTubeSuggestions {
  processingErrors?: string[]; // e.g., ["audioTooQuiet"]
  processingWarnings?: string[]; // e.g., ["lowResolution"]
  processingHints?: string[]; // e.g., ["nonStreamableFormat"]
  tagSuggestions?: Array<{
    tag?: string; // Suggested tag
    categoryRestricts?: string[]; // Restricted categories
  }>;
  editorSuggestions?: string[]; // e.g., ["motion", "stabilize"]
}

// LiveStreamingDetails part (for live broadcasts)
export interface YouTubeLiveStreamingDetails {
  actualStartTime?: string; // ISO 8601, when stream started
  actualEndTime?: string; // ISO 8601, when stream ended
  scheduledStartTime?: string; // ISO 8601, planned start
  scheduledEndTime?: string; // ISO 8601, planned end
  concurrentViewers?: string; // Number of current viewers (as string)
  activeLiveChatId?: string; // ID of the live chat
}
// Type for a single video category (youtube#videoCategory)
export interface YouTubeVideoCategory {
  kind: "youtube#videoCategory"; // Constant value for the category
  etag: string; // ETag for caching
  id: string; // Category ID, e.g. "1", "10", "23"
  snippet: YouTubeVideoCategorySnippet; // Category metadata
}

// Type for the snippet in a video category
export interface YouTubeVideoCategorySnippet {
  title: string; // Category name, e.g. "Film & Animation"
  assignable: boolean; // Whether the category can be assigned to a video
  channelId: string; // Channel ID, e.g. "UCBR8-60-B28hp2BmDPdntcQ"
}

// Type for the response of video category list (youtube#videoCategoryListResponse)
export interface YouTubeVideoCategoryListResponse {
  kind: "youtube#videoCategoryListResponse"; // Constant value for the category list
  etag: string; // ETag for the entire response
  items: YouTubeVideoCategory[]; // Array of categories
  nextPageToken?: string; // Optional token for the next page
  prevPageToken?: string; // Optional token for the previous page
  pageInfo?: {
    totalResults: number; // Total number of results
    resultsPerPage: number; // Number of results per page
  }; // Optional pagination info
}
