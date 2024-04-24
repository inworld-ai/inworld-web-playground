import './ChatHistory.css';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Actor,
  CHAT_HISTORY_TYPE,
  HistoryItem,
  HistoryItemActor,
  HistoryItemNarratedAction,
  HistoryItemTriggerEvent,
} from '@inworld/web-core';
import { Container } from '@mui/material';

import { useInworld } from '../../contexts/InworldProvider';
import { dateWithMilliseconds } from '../../utils/date';
import { getEmojiByBehavior } from '../../utils/emojis';

type CombinedHistoryItem = {
  interactionId: string;
  messages: (
    | HistoryItemActor
    | HistoryItemNarratedAction
    | HistoryItemTriggerEvent
  )[];
  source: Actor;
  type: CHAT_HISTORY_TYPE;
};

function ChatHistory() {
  const LINE_HEIGHT = 32; // Used to determine scrolling based calculations.

  const refHistoryIcon = useRef<HTMLDivElement>(null);
  const refHistoryScroll = useRef<HTMLDivElement>(null);
  const refHistoryInner = useRef<HTMLDivElement>(null);
  const refHistoryList = useRef<HTMLUListElement>(null);

  const [combinedChatHistory, setCombinedChatHistory] = useState<
    CombinedHistoryItem[]
  >([]);
  const [isInteractionEnd, setIsInteractionEnd] = useState<boolean>(true);

  const { chatHistory } = useInworld();

  const getContent = (
    message:
      | HistoryItemActor
      | HistoryItemNarratedAction
      | HistoryItemTriggerEvent,
  ) => {
    switch (message.type) {
      case CHAT_HISTORY_TYPE.ACTOR:
        return message.text;
      case CHAT_HISTORY_TYPE.NARRATED_ACTION:
        return `<span class="history-action">${message.text}</span>`;
      case CHAT_HISTORY_TYPE.TRIGGER_EVENT:
        return message.name;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!chatHistory || !refHistoryInner.current || !refHistoryScroll.current)
      return;

    // Determines if autoscroll should occur based on how close the scrolling to max scroll.
    const autoScroll: boolean =
      refHistoryScroll.current.scrollHeight -
        refHistoryScroll.current.offsetHeight -
        refHistoryScroll.current.scrollTop <=
      LINE_HEIGHT * 2
        ? true
        : false;

    const history = chatHistory;

    let currentRecord: CombinedHistoryItem | undefined;
    const mergedRecords: CombinedHistoryItem[] = [];

    const hasActors = history.find(
      (record) => record.type === CHAT_HISTORY_TYPE.ACTOR,
    );
    const withoutTriggerEvents = history.filter((record) =>
      [CHAT_HISTORY_TYPE.ACTOR, CHAT_HISTORY_TYPE.INTERACTION_END].includes(
        record.type,
      ),
    );

    for (let i = 0; i < history.length; i++) {
      const item = history[i];
      switch (item.type) {
        case CHAT_HISTORY_TYPE.ACTOR:
        case CHAT_HISTORY_TYPE.NARRATED_ACTION:
          currentRecord = mergedRecords.find(
            (r) =>
              r.interactionId === item.interactionId &&
              [
                CHAT_HISTORY_TYPE.ACTOR,
                CHAT_HISTORY_TYPE.NARRATED_ACTION,
              ].includes(r.messages?.[0]?.type) &&
              r.type === CHAT_HISTORY_TYPE.ACTOR &&
              r.source.name === item.source.name,
          ) as CombinedHistoryItem;

          if (currentRecord) {
            currentRecord.messages.push(item);
          } else {
            currentRecord = {
              interactionId: item.interactionId,
              messages: [item],
              source: item.source,
              type: CHAT_HISTORY_TYPE.ACTOR,
            } as CombinedHistoryItem;
            mergedRecords.push(currentRecord);
          }
          break;
        case CHAT_HISTORY_TYPE.TRIGGER_EVENT:
          // mergedRecords.push({
          //   interactionId: item.interactionId!,
          //   messages: [item],
          //   source: item.source,
          //   type: item.type,
          // });
          break;
        case CHAT_HISTORY_TYPE.INTERACTION_END:
          break;

        default:
          console.error('Chat History Type not found', item);
          break;
      }
    }

    // Interaction is considered ended
    // when there is no actor action yet (chat is not started)
    // or last received message is INTERACTION_END.
    const lastInteractionId =
      withoutTriggerEvents[withoutTriggerEvents.length - 1]?.interactionId;

    const interactionEnd = withoutTriggerEvents.find(
      (event) =>
        event.interactionId === lastInteractionId &&
        event.type === CHAT_HISTORY_TYPE.INTERACTION_END,
    );
    const isInteractionEnd =
      !hasActors || (!!currentRecord && !!interactionEnd);

    setIsInteractionEnd(isInteractionEnd);
    setCombinedChatHistory(mergedRecords);

    if (!autoScroll) return;
    refHistoryScroll.current?.scrollTo({
      top: refHistoryInner.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [
    chatHistory,
    refHistoryInner.current,
    refHistoryList.current,
    refHistoryScroll.current,
  ]);

  useEffect(() => {
    if (refHistoryIcon.current) {
      if (isInteractionEnd) {
        refHistoryIcon.current.style.opacity = '0';
      } else {
        refHistoryIcon.current.style.opacity = '1';
      }
    }
  }, [isInteractionEnd, refHistoryIcon.current]);

  useEffect(() => {
    if (refHistoryList.current) {
      // Clear out the previous history list
      while (
        refHistoryList.current.firstChild &&
        refHistoryList.current.firstChild !== refHistoryIcon.current
      ) {
        refHistoryList.current.removeChild(refHistoryList.current.firstChild);
      }
    }

    if (!refHistoryIcon.current || !refHistoryIcon.current) return;

    let index = 0;
    for (index; index < combinedChatHistory.length; index++) {
      const item = combinedChatHistory[index];
      let emoji;
      const { messages } = item;
      let actorSource = 'AGENT';
      const message = item.messages[0];
      const title =
        item.type === CHAT_HISTORY_TYPE.ACTOR ||
        item.type === CHAT_HISTORY_TYPE.TRIGGER_EVENT
          ? `${dateWithMilliseconds(message.date)} (${item.interactionId})`
          : '';

      if (item.type === CHAT_HISTORY_TYPE.ACTOR) {
        actorSource = item.source.isCharacter ? 'AGENT' : 'PLAYER';
        // if (item.source.isCharacter) {
        //   const emotion = this.emotions[item.interactionId];
        //   if (emotion?.behavior) {
        //     emoji = getEmojiByBehavior(emotion.behavior);
        //   }
        // }
      }

      const chatItem = document.createElement('ul');
      chatItem.classList.add('history-message-group');
      chatItem.classList.add(`history-message-group--${actorSource}`);

      const chatItemBubble = document.createElement('li');
      chatItemBubble.classList.add('history-message-chat-bubble');
      chatItemBubble.setAttribute('title', title);
      chatItemBubble.setAttribute('key', index.toString());
      chatItemBubble.setAttribute('data-id', message.id);
      chatItem.appendChild(chatItemBubble);

      const chatItemBubbleStack = document.createElement('div');
      chatItemBubbleStack.classList.add('history-message-chat-bubble-stack');
      chatItemBubble.appendChild(chatItemBubbleStack);

      const chatItemHistoryActor = document.createElement('div');
      chatItemHistoryActor.classList.add('history-actor');
      chatItemBubbleStack.appendChild(chatItemHistoryActor);

      const para = document.createElement('p');
      para.classList.add('history-actor-text');
      const node = document.createTextNode(
        messages.map((m) => `${getContent(m)}`).join(''),
      );
      para.appendChild(node);
      chatItemHistoryActor.appendChild(para);
      if (refHistoryList.current) {
        refHistoryList.current.insertBefore(chatItem, refHistoryIcon.current);
      }
    }
  }, [
    combinedChatHistory,
    isInteractionEnd,
    refHistoryIcon.current,
    refHistoryList.current,
  ]);

  return (
    <>
      <Container className="containerChatHistory">
        <div className="history-container" id="history-container">
          <div
            ref={refHistoryScroll}
            className="history-scroll"
            id="history-scroll"
          >
            <div
              ref={refHistoryInner}
              className="history-inner"
              id="history-inner"
            >
              <ul
                ref={refHistoryList}
                className="history-list"
                id="history-list"
              >
                <div
                  ref={refHistoryIcon}
                  className="history-typing-icon"
                  id="history-typing-icon"
                >
                  <div className="history-typing-inner">
                    <div className="history-typing-left"></div>
                    <div className="history-typing-mid"></div>
                    <div className="history-typing-right"></div>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default ChatHistory;
