import Anthropic from "@anthropic-ai/sdk";
import { Messages } from "@anthropic-ai/sdk/src/resources/messages.js";
import { Stream } from "@anthropic-ai/sdk/streaming.js";

require("dotenv").config();

const anthropic = new Anthropic();

const defaultMessage: Messages.MessageCreateParamsStreaming = {
  model: process.env["ANTHROPIC_CLAUDE_MODEL"]!,
  max_tokens: parseInt(process.env["ANTHROPIC_MAX_TOKENS"] || "1024", 10),
  messages: [],
  stream: true,
};

type MessageRole = "user" | "assistant";

const isValidMessageRole = (role: string | undefined): role is MessageRole => {
  return role !== undefined && ["user", "assistant"].includes(role);
};

const defaultMessageRole: MessageRole = isValidMessageRole(
  process.env["ANTHROPIC_MESSAGE_ROLE"]
)
  ? process.env["ANTHROPIC_MESSAGE_ROLE"]
  : "user";

const createMessageParams = (content: string): Messages.MessageParam => ({
  role: defaultMessageRole,
  content,
});

async function createMessage(
  message: string
): Promise<Stream<Messages.RawMessageStreamEvent>> {
  return anthropic.messages.create({
    ...defaultMessage,
    messages: [createMessageParams(message)],
  });
}

(async () => {
  const msg = await createMessage("Hello, Claude");
  console.log(msg);

  const reply = {
    status: 400,
    headers: {
      "cf-cache-status": "DYNAMIC",
      "cf-ray": "8cb5bdf838445ca0-RDU",
      connection: "keep-alive",
      "content-length": "190",
      "content-type": "application/json",
      date: "Mon, 30 Sep 2024 16:55:42 GMT",
      "request-id": "req_018dV3gXVRtFJMPbsuosTh3B",
      server: "cloudflare",
      via: "1.1 google",
      "x-cloud-trace-context": "a87157e384f949c137c61904c7dd4d8f",
      "x-robots-tag": "none",
      "x-should-retry": "false",
    },
    request_id: "req_018dV3gXVRtFJMPbsuosTh3B",
    error: {
      type: "error",
      error: {
        type: "invalid_request_error",
        message:
          "Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.",
      },
    },
  };
})();
