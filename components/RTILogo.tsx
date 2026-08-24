import React from "react";

interface RTILogoProps {
  size?: number;
  className?: string;
}

const RTILogo: React.FC<RTILogoProps> = ({
  size = 20,
  className = "",
}) => {
  const brandOrange = "#F25922";

  return (
    <div
      className={`flex items-center gap-3 font-sans select-none ${className}`}
    >
      {/* Left side: i graphic */}
      <div className="flex flex-col items-center">
        <div
          className="rounded-full"
          style={{
            backgroundColor: brandOrange,
            width: size,
            height: size,
            marginBottom: size * 0.08,
          }}
        />

        <div
          style={{
            backgroundColor: brandOrange,
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
        <div className="text-black" style={{ marginBottom: size * 0.08 }}>
          Right To
        </div>

        <div style={{ color: brandOrange }}>
          Information
        </div>
      </div>
    </div>
  );
};

export default RTILogo;
