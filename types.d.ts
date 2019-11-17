declare type AssetData = {
  hash?: string;
  id?: string;
  MIMEType?: string;
  type?: string;
  url?: string;

};

declare type SlideData = {
  assets?: string[];
  id?: string;
  type?: string;
};

declare type LayerData = {
  classNames?: string;
  id?: string;
  slide?: string;
  state?: any;
};

declare type MessageData = {
  assets: AssetData[];
  slides: SlideData[];
  layers: LayerData[];
};
