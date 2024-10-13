export interface NavItem {
  title: string;
  icon: JSX.Element;
}

export interface Community {
  title: string;
  image: string;
}

export interface Market {
  id?: number;
  title: string;
  description?: string;
  banner: string;
  outcomes: Outcome[];
  betEndTime: number;
}

interface Outcome {
  id: string;
  title: string;
  image?: string;
  odds?: number;
}

export interface PostItem {
  community: string;
  title: string;
  image: string;
}
