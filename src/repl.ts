import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @howToUse
 * 在package.json中 "repl": "nest start --watch --entryFile repl"
 * terminal 中 npm run repl
 * methods(MeetingRoomService)
 * get(MeetingRoomService).initData()


 */
async function bootstrap() {
  const replServer = await repl(AppModule);
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err);
    }
  });
}
bootstrap();
