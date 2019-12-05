declare type AssetData = {
  readonly hash?: string;
  readonly id?: string;
  readonly MIMEType?: string;
  readonly type?: string;
  readonly url?: string;

};

declare type LayerData = {
  readonly assets?: string[];
  readonly id?: string;
  readonly slide?: string;
  readonly state?: any;
  readonly type?: string;
};

declare type UpdateData = {
  readonly assets: AssetData[];
  readonly layers: LayerData[];
};

declare type MessageData = {
  readonly type: 'update';
  readonly data: UpdateData;
} | {
  readonly type: 'keepalive';
  readonly data: null
};

declare type UfiLayerElement = HTMLElement & {
  ufiState: any;
  ufiStateCallback: (state: any) => void | null;
};
