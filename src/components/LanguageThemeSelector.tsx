
import { Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";

const LanguageThemeSelector = () => {
  const { language, theme, setLanguage, setTheme, t } = useApp();

  return (
    <div className="flex items-center space-x-2">
      {/* Language Selector */}
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-24 h-10 bg-transparent border-gold-500/30 text-gold-300">
          <Globe className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-gold-500/30">
          <SelectItem value="fr" className="text-gold-300 hover:bg-gold-500/10">FR</SelectItem>
          <SelectItem value="en" className="text-gold-300 hover:bg-gold-500/10">EN</SelectItem>
          <SelectItem value="ar" className="text-gold-300 hover:bg-gold-500/10">AR</SelectItem>
        </SelectContent>
      </Select>

      {/* Theme Selector */}
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-24 h-10 bg-transparent border-gold-500/30 text-gold-300">
          <Palette className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-gold-500/30">
          <SelectItem value="dark" className="text-gold-300 hover:bg-gold-500/10">
            {t('dark_theme')}
          </SelectItem>
          <SelectItem value="light" className="text-gold-300 hover:bg-gold-500/10">
            {t('light_theme')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageThemeSelector;
