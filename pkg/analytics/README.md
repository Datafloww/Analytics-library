![NPM Version](https://img.shields.io/npm/v/%40datafloww%2Fanalytics)
 ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@datafloww/analytics) ![GitHub](https://img.shields.io/github/license/datafloww/analytics-library)

## Installation

To install the `@datafloww/analytics` package, run:

```sh
npm install @datafloww/analytics
```

## Initialization

To initialize the analytics library, import the `Analytics` class and call the `init` method with your write key:

```javascript
import { Analytics } from "@datafloww/analytics";

const analytics = Analytics.init({ key: "YOUR_WRITE_KEY" });
```

## Usage

You can now use the `analytics` instance to track custom events. Here is an example:

```javascript
// Example: Track a custom event
analytics.track("event_name", {
    property1: "value1",
    property2: "value2",
});
```
