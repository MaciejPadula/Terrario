import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
// Komponent animowanego tekstu (efekt na literach)
const AnimatedText: React.FC<{ text: string }> = ({ text }) => {
  useEffect(() => {
    if (!document.head.querySelector('[data-flywhite-text]')) {
      const style = document.createElement('style');
      style.innerHTML = `
        .flywhite-text {
          display: inline-block;
          background: linear-gradient(90deg, #888 0%, #888 25%, #fff 50%, #888 75%, #888 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: flyWhiteText 1.8s linear infinite;
        }
        @keyframes flyWhiteText {
          0%   { background-position: 150% center; }
          100% { background-position: -50% center; }
        }
      `;
      style.setAttribute('data-flywhite-text', 'true');
      document.head.appendChild(style);
    }
  }, []);
  return (
    <span className="flywhite-text">{text}</span>
  );
};

type ChatBlockSkillProps = {
  skillName: string;
};

const skillNameToTextMap: Record<string, string> = {
  "GetUserCollections": "ai.skills.getCollections",
  "GetListAnimals": "ai.skills.getListAnimals",
};

export function ChatBlockSkill(props: ChatBlockSkillProps) {
  const { t } = useTranslation();
  const text = t(skillNameToTextMap[props.skillName] || props.skillName);
  return (
    <Flex direction="row" alignItems="center" gap="0.5rem">
      <AnimatedText text={text} />
    </Flex>
  );
}
