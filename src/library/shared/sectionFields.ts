import type {
  StyledTextValue,
  ThemeColor,
  TranslatableAssetImage,
  TranslatableRichText,
  TranslatableString,
  YextEntityField,
} from "@yext/visual-editor";

export type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledRichTextField = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledTextStyles = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type ImageField = {
  image: YextEntityField<TranslatableAssetImage>;
};

export const getLocalizedString = (value?: TranslatableString): string =>
  typeof value === "string" ? value : value?.defaultValue || "";

export const imageAspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
  { label: "3:5", value: 0.6 },
  { label: "9:16", value: 0.56 },
  { label: "1:2", value: 0.5 },
  { label: "1:3", value: 0.33 },
  { label: "1:4", value: 0.25 },
];
