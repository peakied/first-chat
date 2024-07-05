package com.java.messageback.Component;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    private MessageType type;
    private String text;
    private String sender;
    private String sessionId;
}
