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
  const textStyle = {
    fontFamily:
      richTextStyleOverrides?.fontFamily === "default"
        ? undefined
        : richTextStyleOverrides?.fontFamily,
    fontSize:
      richTextStyleOverrides?.fontSize === "default"
        ? undefined
        : richTextStyleOverrides?.fontSize,
    fontStyle:
      richTextStyleOverrides?.fontStyle === "default"
        ? undefined
        : richTextStyleOverrides?.fontStyle,
    fontWeight:
      richTextStyleOverrides?.fontWeight === "default"
        ? undefined
        : richTextStyleOverrides?.fontWeight,
    textTransform:
      richTextStyleOverrides?.textTransform === "default"
        ? undefined
        : richTextStyleOverrides?.textTransform,
  };
  const styleValues = Object.fromEntries(
    Object.entries(textStyle).filter(([, style]) => style !== undefined),
  );
  const bodyVariables = Object.fromEntries(
    Object.entries(styleValues)
      .map(([property, style]) => [`--${property}-body-${property}`, style]),
  );
  const bodyOverrides = Object.fromEntries(
    Object.entries(styleValues)
      .map(([property, style]) => [`--business-financial-services-body-${property}`, style]),
  );
  const color =
    typeof richTextStyleOverrides?.color === "object"
      ? getThemeColorCssValue(richTextStyleOverrides.color)
      : richTextStyleOverrides?.color;
  const colorStyle = color === undefined ? {} : { color };

  if (React.isValidElement(value)) {
    if (!richTextStyleOverrides) return value;
    const applyOverrides = (
      node: React.ReactNode,
      isRoot = false,
    ): React.ReactNode => {
      if (!React.isValidElement(node)) return node;
      if (node.type === MaybeRTF) {
        const element = node as React.ReactElement<MaybeRTFProps>;
        return React.cloneElement(element, {
          richTextStyleOverrides: { ...textStyle, ...colorStyle },
          style: {
            ...element.props.style,
            ...styleValues,
            ...bodyVariables,
            ...bodyOverrides,
            ...colorStyle,
          },
        });
      }

      const element = node as React.ReactElement<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      }>;
      const classNames = element.props.className?.split(/\s+/) ?? [];
      const isRichTextWrapper = classNames.includes("rtf-wrapper") ||
        classNames.includes("rtf-theme");
      return React.cloneElement(element, {
        children: React.Children.map(element.props.children, (child) =>
          applyOverrides(child),
        ),
        style:
          isRoot || isRichTextWrapper
            ? {
              ...element.props.style,
              ...styleValues,
              ...bodyVariables,
              ...bodyOverrides,
              ...colorStyle,
            }
            : element.props.style,
      });
    };
    return applyOverrides(value, true);
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;
  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={{ ...textStyle, ...colorStyle }}
      style={{ ...styleValues, ...bodyVariables, ...bodyOverrides, ...colorStyle }}
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
