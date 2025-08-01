import logoImage from "@assets/learn logo_1754083915790.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-10",
    md: "h-16", 
    lg: "h-20",
    xl: "h-28"
  };

  return (
    <img 
      src={logoImage} 
      alt="Learn a Language" 
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
}

export function LogoWithText({ size = "md", className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size={size} />
    </div>
  );
}