"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Play, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  WATCH_HISTORY: "watch-history",
  ALL_EPISODE_TIMES: "all_episode_times",
};

interface WatchHistoryItem {
  episodeNumber: number;
  episodeId: string;
  timestamp: number;
  animeTitle?: string;
  animeImage?: string;
  episodeImage?: string;
  cover?: string;
}

interface EpisodePlaybackInfo {
  currentTime: number;
  playbackPercentage: number;
}

interface ExtendedWatchHistoryItem extends WatchHistoryItem {
  animeId: string;
  playbackInfo: EpisodePlaybackInfo;
}

export default function HistoryPage() {
  const [watchHistoryData, setWatchHistoryData] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");

  // Initialize data on client side
  useEffect(() => {
    setWatchHistoryData(localStorage.getItem(LOCAL_STORAGE_KEYS.WATCH_HISTORY));
  }, []);

  // Process watch history data
  const watchHistoryItems = useMemo(() => {
    if (!watchHistoryData) return [];

    try {
      const historyData: Record<string, WatchHistoryItem> =
        JSON.parse(watchHistoryData);
      const episodePlaybackData: Record<string, EpisodePlaybackInfo> =
        JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_KEYS.ALL_EPISODE_TIMES) || "{}"
        );

      // Convert to array and add additional data
      let items = Object.entries(historyData).map(([animeId, item]) => ({
        animeId,
        ...item,
        playbackInfo: episodePlaybackData[item.episodeId] || {
          currentTime: 0,
          playbackPercentage: 0,
        },
      }));

      // Filter by search query
      if (searchQuery) {
        items = items.filter((item) =>
          item.animeTitle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort items
      switch (sortBy) {
        case "recent":
          items.sort((a, b) => b.timestamp - a.timestamp);
          break;
        case "title":
          items.sort((a, b) =>
            (a.animeTitle || "").localeCompare(b.animeTitle || "")
          );
          break;
      }

      return items;
    } catch (error) {
      // Silent error handling
      return [];
    }
  }, [watchHistoryData, searchQuery, sortBy]);

  // Handle removing single item from watch history
  const handleRemoveItem = (animeId: string) => {
    try {
      const currentHistory = JSON.parse(watchHistoryData || "{}");
      delete currentHistory[animeId];

      const newHistoryData = JSON.stringify(currentHistory);
      localStorage.setItem(LOCAL_STORAGE_KEYS.WATCH_HISTORY, newHistoryData);
      setWatchHistoryData(newHistoryData);
    } catch (error) {
      // Silent error handling
    }
  };

  // Handle clearing all history
  const handleClearAllHistory = () => {
    if (
      confirm(
        "Are you sure you want to clear all watch history? This action cannot be undone."
      )
    ) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.WATCH_HISTORY);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ALL_EPISODE_TIMES);
      setWatchHistoryData("{}");
    }
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Watch History
          </h1>
          <p className="text-muted-foreground">
            Keep track of your anime watching progress and continue where you
            left off
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Dropdown filters */}
          <div className="flex gap-3">
            <select
              defaultValue="continue"
              className="h-10 rounded-md border bg-background px-4 text-sm min-w-[150px]"
            >
              <option value="continue">Continue Watching</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "title")}
              className="h-10 rounded-md border bg-background px-4 text-sm min-w-[120px]"
            >
              <option value="recent">Last Watched</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Filter by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Clear All */}
          {watchHistoryItems.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleClearAllHistory}
              size="sm"
              className="h-10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Content */}
        {watchHistoryItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-muted-foreground text-lg mb-4">
              {searchQuery
                ? "No anime found matching your search"
                : "No watch history found"}
            </div>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try searching for a different anime title"
                : "Start watching some anime to see your history here"}
            </p>
            {!searchQuery && (
              <Link href="/home">
                <Button>Browse Anime</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {watchHistoryItems.map((item) => {
              const currentTimeFormatted = formatTime(
                item.playbackInfo.currentTime
              );
              const hasProgress = item.playbackInfo.currentTime > 0;

              return (
                <div
                  key={item.animeId}
                  className="group relative bg-card rounded-lg overflow-hidden border border-border/40"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={
                        item.episodeImage ||
                        item.animeImage ||
                        item.cover ||
                        "/placeholder-anime.jpg"
                      }
                      alt={item.animeTitle || "Anime"}
                      fill
                      className="object-cover"
                    />

                    {/* Remove button */}
                    <button
                      className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                      onClick={() => handleRemoveItem(item.animeId)}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Episode badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/80 text-white text-sm font-medium px-2 py-1 rounded">
                        EP {item.episodeNumber}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {hasProgress && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div
                          className="h-full bg-white"
                          style={{
                            width: `${Math.max(
                              item.playbackInfo.playbackPercentage,
                              5
                            )}%`,
                          }}
                        />
                      </div>
                    )}

                    {/* Play button overlay */}
                    <Link
                      href={`/watch/${item.animeId}?ep=${item.episodeNumber}`}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20"
                    >
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="w-6 h-6 fill-black text-black" />
                      </div>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1 text-base">
                      {item.animeTitle || "Unknown Anime"}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
