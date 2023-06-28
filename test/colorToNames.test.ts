import { describe, expect, test } from "vitest";
import {
  colorToNames,
  isDarkColor,
  setConfig,
  ColorInfo,
} from "../src/colorToNames";

describe("colorToNames", () => {
  test("should return color info for #FF0000", () => {
    expect(colorToNames("#FF0000")).toEqual(["#FF0000", "Red", "红色"]);
    expect(colorToNames("#ff0000")).toEqual(["#FF0000", "Red", "红色"]);
  });

  test("should return color info for rgb(255, 0, 0)", () => {
    expect(colorToNames("rgb(255, 0, 0)")).toEqual(["#FF0000", "Red", "红色"]);
  });

  test("should return color info for #2A52BE", () => {
    expect(colorToNames("#2A52BE")).toEqual([
      "#2A52BE",
      "Cerulean blue",
      "蔚蓝",
    ]);
  });

  test("should return null for invalid color", () => {
    expect(colorToNames("invalid color")).toBeNull();
  });
});

describe("isDarkColor", () => {
  test("should return true for #000000", () => {
    expect(isDarkColor("#000000")).toBeTruthy();
  });

  test("should return false for #FFFFFF", () => {
    expect(isDarkColor("#FFFFFF")).toBeFalsy();
  });

  test("should return true for rgb(0, 0, 0)", () => {
    expect(isDarkColor("rgb(0, 0, 0)")).toBeTruthy();
  });

  test("should return false for rgb(255, 255, 255)", () => {
    expect(isDarkColor("rgb(255, 255, 255)")).toBeFalsy();
  });

  test("should return false for #625B57", () => {
    expect(isDarkColor("#625B57")).toBeTruthy();
  });

  test("should return false for invalid color", () => {
    expect(isDarkColor("invalid color")).toBeFalsy();
  });
});

describe("setConfig", () => {
  const colorJson: ColorInfo[] = [
    ["#123456", "name1"],
    ["#234567", "name2"],
  ];
  test("should update colorJson", () => {
    setConfig({ colorJson });
    expect(colorToNames("#234567")).toEqual(["#234567", "name2"]);
  });
});
