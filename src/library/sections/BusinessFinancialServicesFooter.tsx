import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Address, Link } from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  EntityField,
  getAnalyticsScopeHash,
  Image,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  VisibilityWrapper,
  ThemeOptions,
} from "@yext/visual-editor";

const footerTypographyScopeClass = "bfs-footer-typography";
const footerTypographyStyles = `
  .${footerTypographyScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${footerTypographyScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${footerTypographyScopeClass} .bfs-footer-address {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }
  .${footerTypographyScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }
  .${footerTypographyScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }
  .${footerTypographyScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }
  .${footerTypographyScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }
  .${footerTypographyScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }
  .${footerTypographyScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }
  .${footerTypographyScopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: none;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
  .${footerTypographyScopeClass} a:not(.font-button-fontFamily):hover {
    text-decoration: underline;
  }
`;
import type { AddressType } from "@yext/pages-components";

type ImageField = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
};

type FooterLink = {
  label: YextEntityField<TranslatableString>;
  link: YextEntityField<TranslatableString>;
};

type PhoneFieldProps = {
  items: {
    number: YextEntityField<string>;
    label?: string;
  }[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

export type BusinessFinancialServicesFooterProps = {
  logoImage: ImageField;
  emails: {
    label: YextEntityField<TranslatableString>;
    list: YextEntityField<string[]>;
  };
  phones: PhoneFieldProps;
  address: {
    label: YextEntityField<TranslatableString>;
    address: YextEntityField<AddressType>;
    showRegion: boolean;
    showCountry: boolean;
  };
  footerLinksStyles: StyledTextValue;
  primaryLinks: FooterLink[];
  secondaryLinks: FooterLink[];
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const resolveThemeColorCssValue = (value?: ThemeColor): string | undefined => {
  if (!value) return undefined;
  const color = value.selectedColor;
  if (color.startsWith("[") && color.endsWith("]")) {
    return color.slice(1, -1);
  }
  if (color === "white") return "#ffffff";
  if (color.endsWith("-light")) {
    const base = color.replace(/-light$/, "");
    return `hsl(from var(--colors-${base}) h s 98)`;
  }
  if (color.endsWith("-dark")) {
    const base = color.replace(/-dark$/, "");
    return `hsl(from var(--colors-${base}) h s 20)`;
  }
  if (color.startsWith("palette-")) return `var(--colors-${color})`;
  return color;
};

const resolveSurfaceForegroundColor = (
  surfaceColor?: ThemeColor,
): string | undefined =>
  surfaceColor?.contrastingColor
    ? resolveThemeColorCssValue({
        selectedColor: surfaceColor.contrastingColor,
        contrastingColor: surfaceColor.selectedColor,
      })
    : undefined;

const getTextStyle = (
  styles: StyledTextValue,
  color?: string,
): React.CSSProperties => ({
  color,
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const defaultFooterLinksStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "16px",
  fontWeight: "500",
  fontStyle: "default",
  textTransform: "default",
};

const translatableStringDefault = (
  value: string,
): YextEntityField<TranslatableString> => ({
  field: "",
  constantValue: {
    defaultValue: value,
    hasLocalizedValue: "true",
  },
  constantValueEnabled: true,
});

const footerLinkDefault = (label: string, link: string): FooterLink => ({
  label: translatableStringDefault(label),
  link: translatableStringDefault(link),
});

const getTranslatableSummary = (value?: TranslatableString): string =>
  typeof value === "string" ? value : value?.defaultValue || "";

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic",
) => {
  const cleaned = phoneNumberString.replace(/(?!^\+)\+|[^\d+]/g, "");
  const parsed = parsePhoneNumber(cleaned);
  if (!parsed.valid || !parsed.number) {
    return phoneNumberString;
  }
  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const BusinessFinancialServicesFooterFields: YextFields<BusinessFinancialServicesFooterProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    logoImage: {
      label: "Logo Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "select",
          options: ThemeOptions.ASPECT_RATIO,
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
      },
    },
    emails: {
      label: "Emails",
      type: "object",
      objectFields: {
        label: {
          type: "entityField",
          label: "Label",
          filter: { types: ["type.string"] },
        },
        list: {
          type: "entityField",
          label: "Emails",
          filter: {
            types: ["type.string"],
            includeListsOnly: true,
            allowList: ["emails"],
          },
          disallowTranslation: true,
        },
      },
    },
    phones: {
      label: "Phones",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: "Number",
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: "Label",
              type: "text",
            },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            },
            label: "Phone",
          },
          getItemSummary: (item) =>
            item.label ||
            item.number?.constantValue ||
            item.number?.field ||
            "Phone",
        },
        phoneFormat: {
          label: "Phone Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    address: {
      label: "Address",
      type: "object",
      objectFields: {
        label: {
          type: "entityField",
          label: "Label",
          filter: { types: ["type.string"] },
        },
        address: {
          type: "entityField",
          label: "Address",
          filter: {
            types: ["type.address"],
          },
        },
        showRegion: {
          label: "Show Region",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showCountry: {
          label: "Show Country",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    footerLinksStyles: {
      label: "Link Styling",
      type: "styledText",
    },
    primaryLinks: {
      label: "Primary Links",
      type: "array",
      arrayFields: {
        label: {
          label: "Label",
          type: "entityField",
          filter: { types: ["type.string"] },
        },
        link: {
          label: "Link",
          type: "entityField",
          filter: { types: ["type.string"] },
        },
      },
      defaultItemProps: footerLinkDefault("Link", "#"),
      getItemSummary: (item) =>
        getTranslatableSummary(item.label.constantValue) ||
        item.label.field ||
        "Link",
    },
    secondaryLinks: {
      label: "Secondary Links",
      type: "array",
      arrayFields: {
        label: {
          label: "Label",
          type: "entityField",
          filter: { types: ["type.string"] },
        },
        link: {
          label: "Link",
          type: "entityField",
          filter: { types: ["type.string"] },
        },
      },
      defaultItemProps: footerLinkDefault("Link", "#"),
      getItemSummary: (item) =>
        getTranslatableSummary(item.label.constantValue) ||
        item.label.field ||
        "Link",
    },
  };

export const BusinessFinancialServicesFooterComponent: PuckComponent<
  BusinessFinancialServicesFooterProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextBusinessFinancialServicesFooter${getAnalyticsScopeHash(
    props.id,
  )}`;
  const footerForegroundColor = resolveSurfaceForegroundColor(
    props.section.backgroundColor,
  );
  const footerLinkStyle = getTextStyle(
    props.footerLinksStyles,
    footerForegroundColor,
  );
  const image = resolveComponentData(
    props.logoImage.image,
    locale,
    streamDocument,
  );
  const resolvedEmailsValue = resolveComponentData(
    props.emails.list,
    locale,
    streamDocument,
  );
  const resolvedEmailLabelValue = resolveComponentData(
    props.emails.label,
    locale,
    streamDocument,
  );
  const resolvedEmailLabel =
    typeof resolvedEmailLabelValue === "string"
      ? resolvedEmailLabelValue.trim().replace(/:\s*$/, "")
      : "";
  const resolvedEmails = Array.isArray(resolvedEmailsValue)
    ? resolvedEmailsValue.filter(
        (email): email is string =>
          typeof email === "string" && email.length > 0,
      )
    : [];
  const resolvedAddress = resolveComponentData(
    props.address.address,
    locale,
    streamDocument,
  );
  const resolvedAddressLabelValue = resolveComponentData(
    props.address.label,
    locale,
    streamDocument,
  );
  const resolvedAddressLabel =
    typeof resolvedAddressLabelValue === "string"
      ? resolvedAddressLabelValue.trim().replace(/:\s*$/, "")
      : "";
  const resolvedPhones = (props.phones.items ?? [])
    .map((item) => {
      const raw = resolveComponentData(item.number, locale, streamDocument);
      const normalized = typeof raw === "string" ? raw.trim() : "";
      if (!normalized) {
        return null;
      }
      return {
        entityField: item.number,
        label: (item.label?.trim() ?? "").replace(/:\s*$/, ""),
        formatted: formatPhoneNumber(normalized, props.phones.phoneFormat),
        digits: normalized.replace(/\D/g, ""),
        original: normalized,
      };
    })
    .filter(
      (
        item,
      ): item is {
        entityField: YextEntityField<string>;
        label: string;
        formatted: string;
        digits: string;
        original: string;
      } => item !== null,
    );
  const resolveFooterLinks = (links: FooterLink[]) =>
    links.flatMap((item, index) => {
      const label = resolveComponentData(item.label, locale, streamDocument);
      const link = resolveComponentData(item.link, locale, streamDocument);
      const normalizedLabel = typeof label === "string" ? label.trim() : "";
      const normalizedLink = typeof link === "string" ? link.trim() : "";

      return normalizedLabel && normalizedLink
        ? [
            {
              label: normalizedLabel,
              labelField: item.label,
              link: normalizedLink,
              linkField: item.link,
              index,
            },
          ]
        : [];
    });
  const resolvedPrimaryLinks = resolveFooterLinks(props.primaryLinks);
  const resolvedSecondaryLinks = resolveFooterLinks(props.secondaryLinks);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider name={scopeName}>
        <footer
          className={`${footerTypographyScopeClass} px-0 pb-[18px] pt-6`}
          id="footer"
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: footerForegroundColor,
          }}
        >
          <style>{footerTypographyStyles}</style>
          <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-[22px] md:grid-cols-[1.15fr_0.85fr]">
            <div>
              {image ? (
                <div className="mb-2">
                  <EntityField
                    displayName="Logo Image"
                    fieldId={props.logoImage.image.field}
                    constantValueEnabled={
                      props.logoImage.image.constantValueEnabled
                    }
                  >
                    <Image
                      image={image}
                      style={{
                        display: "block",
                        height: "46px",
                        objectFit:
                          props.logoImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                        width: "auto",
                      }}
                    />
                  </EntityField>
                </div>
              ) : null}
              {resolvedEmails.map((email, index) => (
                <p
                  key={`${email}-${index}`}
                  className="m-0 mt-2 text-base leading-6"
                >
                  {index === 0 && resolvedEmailLabel ? (
                    <EntityField
                      displayName="Email Label"
                      fieldId={props.emails.label.field}
                      constantValueEnabled={
                        props.emails.label.constantValueEnabled
                      }
                    >
                      <span>{resolvedEmailLabel}: </span>
                    </EntityField>
                  ) : null}
                  <EntityField
                    displayName="Email Addresses"
                    fieldId={props.emails.list.field}
                    constantValueEnabled={
                      props.emails.list.constantValueEnabled
                    }
                  >
                    <Link
                      cta={{ link: email, linkType: "EMAIL" }}
                      eventName={`footerEmail${index}`}
                      style={{ color: "inherit" }}
                    >
                      {email.replace(/^mailto:/i, "")}
                    </Link>
                  </EntityField>
                </p>
              ))}
              {resolvedPhones.map((phone, index) => {
                const phoneValue = props.phones.includeHyperlink ? (
                  <Link
                    cta={{
                      link: phone.digits,
                      linkType: "PHONE",
                    }}
                    eventName={`footerPhone${index}`}
                    style={{ color: "inherit" }}
                  >
                    {phone.formatted}
                  </Link>
                ) : (
                  <span>{phone.formatted}</span>
                );

                return (
                  <p
                    key={`${phone.label}-${phone.original}-${index}`}
                    className="m-0 mt-2 text-base leading-6"
                  >
                    {phone.label ? `${phone.label}: ` : null}
                    <EntityField
                      displayName="Phone Number"
                      fieldId={phone.entityField.field}
                      constantValueEnabled={
                        phone.entityField.constantValueEnabled
                      }
                    >
                      {phoneValue}
                    </EntityField>
                  </p>
                );
              })}
              {resolvedAddress ? (
                <div className="bfs-footer-address mt-2 text-base leading-6">
                  {resolvedAddressLabel ? (
                    <EntityField
                      displayName="Address Label"
                      fieldId={props.address.label.field}
                      constantValueEnabled={
                        props.address.label.constantValueEnabled
                      }
                    >
                      <span>{resolvedAddressLabel}: </span>
                    </EntityField>
                  ) : null}
                  <EntityField
                    displayName="Address"
                    fieldId={props.address.address.field}
                    constantValueEnabled={
                      props.address.address.constantValueEnabled
                    }
                  >
                    <Address
                      address={resolvedAddress}
                      showRegion={props.address.showRegion}
                      showCountry={props.address.showCountry}
                    />
                  </EntityField>
                </div>
              ) : null}
            </div>
            <div className="grid gap-[18px] pt-2 md:grid-cols-2">
              <div>
                {resolvedPrimaryLinks.map((item) => (
                  <EntityField
                    key={`${item.label}-${item.index}`}
                    displayName="Primary Link Destination"
                    fieldId={item.linkField.field}
                    constantValueEnabled={item.linkField.constantValueEnabled}
                  >
                    <Link
                      cta={{ link: item.link, linkType: "URL" }}
                      eventName={`footerLink${item.index}`}
                      className="mb-1.5 block no-underline"
                      style={footerLinkStyle}
                    >
                      <EntityField
                        displayName="Primary Link Label"
                        fieldId={item.labelField.field}
                        constantValueEnabled={
                          item.labelField.constantValueEnabled
                        }
                      >
                        <span>{item.label}</span>
                      </EntityField>
                    </Link>
                  </EntityField>
                ))}
              </div>
              <div>
                {resolvedSecondaryLinks.map((item) => (
                  <EntityField
                    key={`${item.label}-${item.index}`}
                    displayName="Secondary Link Destination"
                    fieldId={item.linkField.field}
                    constantValueEnabled={item.linkField.constantValueEnabled}
                  >
                    <Link
                      cta={{ link: item.link, linkType: "URL" }}
                      eventName={`footerSecondaryLink${item.index}`}
                      className="mb-1.5 block no-underline"
                      style={footerLinkStyle}
                    >
                      <EntityField
                        displayName="Secondary Link Label"
                        fieldId={item.labelField.field}
                        constantValueEnabled={
                          item.labelField.constantValueEnabled
                        }
                      >
                        <span>{item.label}</span>
                      </EntityField>
                    </Link>
                  </EntityField>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const BusinessFinancialServicesFooter: YextComponentConfig<BusinessFinancialServicesFooterProps> =
  {
    label: "Footer",
    fields: BusinessFinancialServicesFooterFields,
    defaultProps: {
      logoImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/OLT2KExDEKhKlCmIobyRRHN6MFUS77fVs5gIt_FTnBI/450x450.jpg",
            width: 450,
            height: 450,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1,
        imageConstrain: "fixed",
      },
      emails: {
        label: translatableStringDefault("Email"),
        list: {
          field: "emails",
          constantValue: [""],
          constantValueEnabled: false,
        },
      },
      phones: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            },
            label: "Phone",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: false,
      },
      address: {
        label: translatableStringDefault("Address"),
        address: {
          field: "address",
          constantValue: {
            line1: "",
            city: "",
            postalCode: "",
            countryCode: "",
            region: "",
          },
          constantValueEnabled: false,
        },
        showRegion: true,
        showCountry: false,
      },
      footerLinksStyles: defaultFooterLinksStyles,
      primaryLinks: [
        footerLinkDefault("Locations", "#nearby"),
        footerLinkDefault("Services", "#services"),
        footerLinkDefault("Advisors", "#team"),
        footerLinkDefault("Disclosures", "#before-meet"),
      ],
      secondaryLinks: [footerLinkDefault("Contact Us", "#footer")],
      section: {
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
        visibleOnLivePage: true,
      },
    },
    render: (props) => (
      <BusinessFinancialServicesFooterComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "BusinessFinancialServicesFooter",
  displayName: "Footer",
  description: "Footer",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
