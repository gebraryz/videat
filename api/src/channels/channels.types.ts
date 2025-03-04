// Interface representing a single thumbnail of a YouTube channel.
// Contains the image URL and its dimensions.
export interface YouTubeThumbnail {
  url: string; // URL of the thumbnail image
  width: number; // Width of the thumbnail in pixels
  height: number; // Height of the thumbnail in pixels
}

// Interface for a collection of thumbnails of a YouTube channel.
// Thumbnails are available in different sizes: default, medium, and high.
export interface YouTubeThumbnails {
  default?: YouTubeThumbnail; // Default thumbnail (88x88px), optional
  medium?: YouTubeThumbnail; // Medium thumbnail (240x240px), optional
  high?: YouTubeThumbnail; // High thumbnail (800x800px), optional
}

// Interface for localized channel data.
// Contains the title and description tailored to the user's language.
export interface YouTubeLocalized {
  title: string; // Localized title of the channel
  description: string; // Localized description of the channel
}

// Interface for the "snippet" section of the API response.
// Contains basic information about the YouTube channel.
export interface YouTubeChannelSnippet {
  title: string; // Name of the channel
  description: string; // Description of the channel
  customUrl?: string; // Custom URL of the channel (e.g., @Handle), optional
  publishedAt: string; // Date the channel was created in ISO 8601 format (e.g., "2020-01-01T00:00:00Z")
  thumbnails: YouTubeThumbnails; // Object containing the channel's thumbnails
  localized?: YouTubeLocalized; // Localized data, optional
  country?: string; // Country code of the channel (e.g., "US"), optional
}

// Interface representing a single YouTube channel in the API response.
export interface YouTubeChannel {
  kind: "youtube#channel"; // Type identifier for the resource, always "youtube#channel"
  etag: string; // ETag for versioning the channel resource
  id: string; // Unique identifier of the channel (e.g., "UC_x5XG1OV2P6uZZ5FSM9Ttw")
  snippet: YouTubeChannelSnippet; // Object containing basic channel details
}
