import React from "react";
import Link from "next/link";

interface RTILogoProps {
  size?: number;
  className?: string;
  color?: string;
  textColor?: string;
  iconColor?: string;
  rightToColor?: string;
  informationColor?: string;
}

const RTILogo: React.FC<RTILogoProps> = ({
  size = 20,
  className = "",
  color = "#F25922",
  textColor = "black",
  iconColor,
  rightToColor,
  informationColor,
}) => {
  const resolvedIconColor = iconColor || color;
  const resolvedRightToColor = rightToColor || textColor;
  const resolvedInformationColor = informationColor || color;

  return (
    <Link href="/">

      <div
        className={`flex items-center gap-3 font-sans select-none ${className}`}
      >
        {/* Left side: i graphic */}
        <div className="flex flex-col items-center">
          <div
            className="rounded-full"
            style={{
              backgroundColor: resolvedIconColor,
              width: size,
              height: size,
              marginBottom: size * 0.08,
            }}
          />

          <div
            style={{
              backgroundColor: resolvedIconColor,
              width: size,
              height: size * 2,
            }}
          />
        </div>

        {/* Typography */}
        <div
          className="flex flex-col justify-center font-bold uppercase leading-none tracking-wide"
          style={{
            fontSize: size,
          }}
        >
          <div
            style={{
              color: resolvedRightToColor,
              marginBottom: size * 0.08,
            }}
          >
            Right To
          </div>

          <div
            style={{
              color: resolvedInformationColor,
            }}
          >
            Information
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RTILogo;
