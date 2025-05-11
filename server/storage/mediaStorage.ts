import { Media } from "../../shared/schema.js";

export class MediaStorage {
  private medias: Map<number, Media>;
  private mediaId: number;

  constructor(mediaId: number = 1, medias: Map<number, Media> = new Map()) {
    this.medias = medias;
    this.mediaId = mediaId;
  }

  async getAllMedias(): Promise<Media[]> {
    return Array.from(this.medias.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getMediaById(id: number): Promise<Media | null> {
    const media = this.medias.get(id);
    return media || null;
  }

  async createMedia(media: Omit<Media, "id" | "createdAt">): Promise<Media> {
    const newMedia: Media = {
      id: this.mediaId++,
      ...media,
      createdAt: new Date().toISOString(),
    };
    this.medias.set(newMedia.id, newMedia);
    return newMedia;
  }

  async deleteMedia(id: number): Promise<boolean> {
    return this.medias.delete(id);
  }
}
