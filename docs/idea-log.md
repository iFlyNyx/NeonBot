# TheNeonBot Idea Log

## Version 0.0.1 (basically)

Initial version released was for the debut stream for SkyyeXVII and had minimal functionality but worked for the needs at the time. It was limited in it's expansion ability but included some basic functionality:

- twitch websocket management
- chatbot ad notifications
- twitch message parser for commands
- chat message overlay with full emote support
- simplistic database design for managing allowed users
- simplistic api for managing initial subscription to bot from twith account

## Version 0.0.2 Ideas

Additional features I'd like to include on the next version of the bot are listed below. This would be a relatively large change to the overall model to support more dynamic features for a stream

This is not an exhaustive list of features to work on and include, but rather a starting point. Additional features can be added as identified and extended based on what else could be beneficial

### Ideal Release Targets

| Status | Area | Idea | Notes |
| ---- | ---- | ---- | ---- |
| Not Started | Core | Implement Centralized Logging | Grafana/Prometheus/Loki |
| Not Started | Core | Rework web socket management | needs increased stability for reconnect |
| Not Started | Core | Concrete Twitch Event Classes | Avoid single Message object for all |
| Not Started | Core | Rework stream elements service | |
| Not Started | Core | Include KoFi service | most likely uses an external gateway for receiving messages |
| Not Started | Core | Youtube chat connections | Implement a listener for youtube chats |
| Not Started | Core | Implement loyalty system | similar to streamelements watchtime basically |
| Not Started | Core | Resiliency for network connections | avoid a restart being needed before every stream |
| Not Started | Core | Simpler message flow process | currently complex between services, rethink if it can be simplified |
| Not Started | Core | Full unboarding/offboarding support | Ability for a user to navigate to the onboarding url and be feature complete + offboarding events |
| Not Started | Core | 7tv event hub listeners | ability to upsert emote modifications without manual cache intervention |
| Not Started | Core | Automated database startup integration | Support direct deployments and default startup to servers |
| Not Started | Chat | Database side command definitions | App doesn't hardcode strings for messages, commands tied to minimum levels (mod, vip, sub, etc) |
| Not Started | Chat | Time based chat events | interval based sent chat messages that are user defined |
| Not Started | Chat | Basic global commands | ex) uptime, title, game, etc |
| Not Started | Chat | Customizeable chatbot account | allow users to connect their own chatbot on top of the framework of the rest of the stack |
| Not Started | UI | AvaloniaUI framework over razer page webui | Key management area for the bot, hosted as an app instead of a web ui |
| Not Started | UI | Customizable chat overlays | At minimum, enable configureable overlay and not static loaded overlays |
| Not Started | UI | Implement custom user defined commands | Enable variables for command types so users can interact with message content |
| Not Started | UI | Stream overlay multichat implementation | Ideal support for twitch + youtube for starters but framework agnostic |
| Not Started | Metrics | Stream based event metrics | Total messages, chatters, raids, follows, subs, etc |

### Additional Release Targets

- Patreon integration
- Audio playback
    - specific emotes
    - specific commands
    - specific events
- Kick integration
- event/activity feed
- mute/pause alerts
- full discord integration
