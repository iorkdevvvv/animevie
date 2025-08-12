# Unified Player Component

A unified video player component that combines both iframe and advanced video player functionality, allowing users to seamlessly switch between different player modes.

## Features

- **Dual Player Modes**: Switch between advanced MediaPlayer and iframe player
- **Auto-play Controls**: Toggle autoplay, auto-next, and auto-skip functionality
- **Episode Navigation**: Built-in previous/next episode controls
- **Skip Times**: Automatic intro/outro detection and skipping
- **Subtitles Support**: Multi-language subtitle support
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Tracking**: Saves and restores playback position

## Usage

### Basic Usage

```tsx
import { UnifiedPlayer } from '@/components/watch/video';

function WatchPage() {
  const handleEpisodeEnd = async () => {
    // Navigate to next episode
  };

  const handlePrevEpisode = () => {
    // Navigate to previous episode
  };

  const handleNextEpisode = () => {
    // Navigate to next episode
  };

  return (
    <UnifiedPlayer
      episodeId="anime-id-episode-1$sub"
      animeTitle="Your Anime Title"
      episodeNumber="1"
      onEpisodeEnd={handleEpisodeEnd}
      onPrevEpisode={handlePrevEpisode}
      onNextEpisode={handleNextEpisode}
    />
  );
}
```

### Advanced Usage

```tsx
import { UnifiedPlayer } from '@/components/watch/video';

function WatchPage() {
  const [downloadLink, setDownloadLink] = useState("");

  return (
    <UnifiedPlayer
      episodeId="anime-id-episode-1$sub"
      category="sub"
      banner="https://example.com/banner.jpg"
      malId="12345"
      episodeNumber="1"
      animeTitle="Your Anime Title"
      serverName="vidcloud"
      language="sub"
      defaultMode="advanced"
      updateDownloadLink={setDownloadLink}
      onEpisodeEnd={handleEpisodeEnd}
      onPrevEpisode={handlePrevEpisode}
      onNextEpisode={handleNextEpisode}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `episodeId` | `string` | **required** | Unique identifier for the episode |
| `category` | `string` | `"sub"` | Episode category (sub/dub) |
| `banner` | `string` | `undefined` | Banner image URL for the player |
| `malId` | `string` | `undefined` | MyAnimeList ID for skip times |
| `episodeNumber` | `string` | `undefined` | Episode number for display |
| `animeTitle` | `string` | `undefined` | Anime title for display |
| `serverName` | `string` | `"vidcloud"` | Streaming server name |
| `language` | `string` | `"sub"` | Audio language (sub/dub) |
| `defaultMode` | `'advanced' \\| 'iframe'` | `"advanced"` | Initial player mode |
| `updateDownloadLink` | `(link: string) => void` | `() => {}` | Callback for download link updates |
| `onEpisodeEnd` | `() => Promise<void>` | **required** | Called when episode ends |
| `onPrevEpisode` | `() => void` | **required** | Called when previous button is clicked |
| `onNextEpisode` | `() => void` | **required** | Called when next button is clicked |

## Player Modes

### Advanced Mode
- Full-featured video player with custom controls
- Subtitle support
- Skip times integration
- Progress tracking
- Download link extraction

### Iframe Mode
- Lightweight iframe-based player
- Faster loading for some content
- Fallback option when advanced player fails
- Basic controls only

## Controls

The player includes the following controls:

- **Mode Toggle**: Switch between advanced and iframe player
- **Autoplay**: Toggle automatic playback
- **Auto Skip**: Automatically skip intro/outro (advanced mode only)
- **Previous/Next**: Navigate between episodes
- **Auto Next**: Automatically play next episode when current ends

## API Integration

The player automatically fetches streaming data from your API when in advanced mode. The API now uses Promise.all to fetch data from both HD-2 and HD-3 servers simultaneously and returns the best available source. Make sure your API returns the following structure:

```json
{
  "success": true,
  "data": {
    "id": "the-summer-hikaru-died-19783::ep=143115",
    "type": "sub",
    "link": {
      "file": "https://example.com/video.m3u8",
      "type": "hls"
    },
    "tracks": [
      {
        "url": "https://example.com/subtitles.vtt",
        "lang": "English"
      }
    ],
    "intro": {
      "start": 91,
      "end": 180
    },
    "outro": {
      "start": 1205,
      "end": 1294
    },
    "server": "HD-2"
  }
}
```

### Server Selection Logic

The API automatically selects the best server based on the following priority:

1. **Both servers available**: Returns HD-2 server data
2. **Only HD-2 available**: Returns HD-2 server data  
3. **Only HD-3 available**: Returns HD-3 server data
4. **Both servers fail**: Returns `{ success: false, data: null }`

### Error Handling

If both servers fail or return no data, the API returns:

```json
{
  "success": false,
  "data": null,
  "error": "Error description"
}
```

## Styling

The player uses CSS custom properties for theming. You can customize the appearance by overriding these variables:

```css
:root {
  --global-div: #your-background-color;
  --global-text: #your-text-color;
  --primary-accent: #your-accent-color;
  --global-border-radius: 8px;
}
```

## Dependencies

- `@vidstack/react` - For advanced video player functionality
- `styled-components` - For component styling
- `react-icons` - For UI icons

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
