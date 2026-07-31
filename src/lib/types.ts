export interface VoteLink {
  id: string;
  name: string;
  logo_url: string | null;
  description: string;
  vote_url: string;
  reward_key_amount: number;
  reward_money_amount: number;
  display_order: number;
  enabled: boolean;
}

export interface Rank {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  gradient_from: string;
  gradient_to: string;
  badge_text: string;
  image_url: string | null;
  display_order: number;
  enabled: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  rank_weight: number;
  avatar_url: string | null;
  discord_username: string | null;
  display_order: number;
  enabled: boolean;
}

export interface SiteSettings {
  server_name: string;
  java_ip: string;
  bedrock_ip: string;
  bedrock_port: number;
  discord_invite: string;
  discord_server_id: string;
  hero_background_url: string;
  website_logo_url: string;
  vote_reward_key: number;
  vote_reward_money: number;
  tagline: string;
}

export interface McStatus {
  online: boolean;
  players: { online: number; max: number };
  ping: number | null;
  version: string | null;
  motd: string | null;
  error?: string;
}

export interface DiscordStatus {
  available: boolean;
  name: string | null;
  iconUrl: string | null;
  memberCount: number | null;
  presenceCount: number | null;
  voiceCount: number | null;
  reason?: string;
}
