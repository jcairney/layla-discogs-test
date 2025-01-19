import ReleaseBase from "./release-base.model";

export default interface SearchRelease extends ReleaseBase {
  "id": number,
  "title": string,
  "resource_url": string,

  "country": string,
  "format": [string],
  "label": [string],
  "type": "release",
  "genre": [string],
  "style": [string],
  "barcode": [string],
  "master_id": number,
  "master_url": string,
  "uri": string,
  "catno": string,
  "thumb": string,
  "cover_image": string,
  "community": {
    "want": number,
    "have": number,
  },
};
