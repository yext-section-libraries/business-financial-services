import * as React from "react";
import {
  MaybeRTF,
  getThemeColorCssValue,
  type MaybeRTFProps,
  type RichText,
  type StyledTextValue,
  type ThemeColor,
} from "@yext/visual-editor";

export type RichTextStyleOverrides = NonNullable<
  MaybeRTFProps["richTextStyleOverrides"]
>;

export const getTextStyles = (
  styles: StyledTextValue,
  color?: string | ThemeColor,
  fallbackColor?: string | ThemeColor,
): React.CSSProperties => ({
  color: getThemeColorCssValue(color ?? fallbackColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

export const renderRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  if (React.isValidElement(value)) {
    if (!richTextStyleOverrides) {
      return value;
    }

    const color = getThemeColorCssValue(richTextStyleOverrides.color);
    return React.cloneElement(
      value as React.ReactElement<{ style?: React.CSSProperties }>,
      {
        style: {
          ...(value.props as { style?: React.CSSProperties }).style,
          ...richTextStyleOverrides,
          color,
        } as React.CSSProperties,
      },
    );
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;
  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) return true;
  if (typeof value === "string") return value.trim() === "";
  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }
  return false;
};
