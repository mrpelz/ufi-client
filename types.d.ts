declare type AssetData = {
  hash?: string;
  id?: string;
  MIMEType?: string;
  type?: string;
  url?: string;

};

declare type LayerData = {
  assets?: string[];
  classNames?: string;
  id?: string;
  slide?: string;
  state?: any;
  type?: string;
};

declare type UpdateData = {
  assets: AssetData[];
  layers: LayerData[];
};

declare type MessageData = {
  type: 'update';
  data: UpdateData;
} | {
  type: 'keepalive';
  data: null
};
