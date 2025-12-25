// Live implementations
export { KeyValueStoreLive } from './KeyValueStoreLive'
export { KeyValueStoreConfigLive } from './KeyValueStoreConfigLive'
export { EmailQueueLive } from './EmailQueueLive'
export { SesClientLive } from './SesClientLive'
export { SesClientConsole } from './SesClientConsole'
export { EmailServiceLive } from './EmailServiceLive'

// Test implementations
export { KeyValueStoreTest } from './KeyValueStoreTest'
export {
  SesClientTest,
  makeSesClientTest,
  makeSesClientFailing,
  type RecordedEmail
} from './SesClientTest'
export { EmailServiceTest } from './EmailServiceTest'
