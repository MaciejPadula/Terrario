import type { ChatMessage } from "./Chat";
import { ChatBlockSkill } from "./ChatBlockSkill";
import { ChatBlockText } from "./ChatBlockText";

type ChatBlockProps = {
  message: ChatMessage;
};

export function ChatBlock(props: ChatBlockProps) {
  function selectComponent() {
    switch (props.message.role) {
      case "system":
        return <ChatBlockSkill skillName={props.message.content} />;
      default:
        return <ChatBlockText message={props.message} />;
    }
  }

  return <>{selectComponent()}</>;
}
