import Boat, { Part } from "..";
import * as THREE from "three";
export type PartSearchOptions = (RegExp | string)[];

export interface StyleCustomization {
  /**
   * Name of Target part
   */
  targetParts: PartSearchOptions;
  /**
   * Text to display on placeholder
   */
  label: string;
  /**
   * Array of options, either color or texture
   */
  options: {
    /**
     * Define type to correctly set value
     */
    type: "color" | "texture";
    /**
     * Color representation(hex string/css style) or key of texture in case of type:"texture"
     */
    value: string;
    /**
     * Is this default option?
     * If default is not declared in none of options then first option is default
     */
    default?: boolean;
  }[];
}

export interface VisibilityCustomization {
  /**
   * Array of options
   */
  options: {
    /**
     * Path to option placeholder image
     */
    imageURL: string;
    /**
     * Exact Names or Regexes of visible Parts
     */
    targetParts: PartSearchOptions;
    /**
     * Is this default option?
     * If default is not declared in none of options then first option is default
     */
    default?: boolean;
  }[];
}

export interface CustomizationConfig {
  /**
   * Path to all additional textures used in customizator,
   * will be saved by provided key
   */
  texturePresets?: {
    key: string;
    url: string;
  }[];
  transparentParts?: {
    [partName: string]: number;
  };
  customization: {
    [placeholderName: string]: {
      placeholderLabel: string;
      styleCustomization?: StyleCustomization[];
      visibilityCustomization?: VisibilityCustomization[];
    };
  };
}

/**
 * Class for managing different customization states
 */
export default class CustomizationManager {
  styleMap = new Map<StyleCustomization, Part[]>();
  visibilityMap = new Map<VisibilityCustomization, Part[]>();
  styleCustomizableParts: Part[];

  constructor(
    private readonly boat: Boat,
    private readonly config: CustomizationConfig
  ) {
    /**
     * Find parts needed for customization
     * Group parts by common customization
     */
    Object.values(this.config.customization).forEach((customization) => {
      customization.styleCustomization?.forEach((c) =>
        this.styleMap.set(c, this.boat.getMatchingParts(c.targetParts))
      );

      customization.visibilityCustomization?.forEach((c) =>
        this.visibilityMap.set(
          c,
          this.boat.getMatchingParts(c.options.flatMap((o) => o.targetParts))
        )
      );
    });

    this.styleCustomizableParts = [...this.styleMap.values()].flat();

    /**
     * Hide all visibility customizable parts
     */
    this.visibilityMap.forEach((parts) =>
      parts.forEach((part) => {
        if (!part.name.includes("deeb_vee_full_211919")) {
          part.visible = false
        }
      })
    );
  }

  /**
   * Finds parts with corresponding customization and updates them according to option
   */
    hexToRgb(hex : string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  setStyleOption(
    customization: StyleCustomization,
    option: StyleCustomization["options"][number]
  ) {
    this.styleMap
      .get(customization)
      .forEach((part) =>{ 
        try {
          part.material.setColor(option.value)
          
        } catch (error) {
          try {

              var c = this.hexToRgb(option.value);
              part.material.color = new THREE.Color(c.r,c.g,c.b);

          } catch (error) {

            
          }
        }
      });
  }

  /**
   * Finds parts with corresponding customization and hides/shows them according to option
   */
  setVisibilityOption(
    customization: VisibilityCustomization,
    option: VisibilityCustomization["options"][number]
  ) {
    /** Hide all parts within this customization */
    this.visibilityMap
      .get(customization)
      .forEach((part) => (part.visible = false));

    /** Show only parts which are defined in option */
    this.boat
      .getMatchingParts(option.targetParts)
      .forEach((part) => (part.visible = true));
  }
  setVisibilityOption_New(
    option
  ) {
    /** Hide all parts within this customization */
    this.visibilityMap.forEach((parts) =>
      parts.forEach((part) => {

          part.visible = false
        
      })
    );

    /** Show only parts which are defined in option */
    this.boat
      .getMatchingParts(option)
      .forEach((part) => (part.visible = true));
  }
  /**
   * Checks if part's style can be customized
   */
  isPartStyleCustomizable(part: Part) {
    return this.styleCustomizableParts.includes(part);
  }
}
