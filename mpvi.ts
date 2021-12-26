import { spawn } from 'child_process';

if (process.argv.length <= 2) {
  throw "need more commands";
}

console.log('\n\n')

const youtubeUrl = process.argv[process.argv.length - 1];

const startMPV = (url: string) => {
  const command = "mpv";
  const args = [url];

  const child = spawn(command, args);

  child.stdout.on('data', (data: any) => {
    if (process.argv.includes('--verbose')) {
      console.log(`stdout: ${data}`);
    }
  });

  child.stderr.on('data', (data: any) => {
    if (process.argv.includes('--verbose')) {
      console.error(`stderr: ${data}`);
    }
  });

  child.on('close', (code: any) => {
    // console.log(`child process exited with code ${code}`);
  });
}

const getDescription = (url: string) => {
  const command = "youtube-dl";

  const child = spawn(command, ['--skip-download', '--get-description', url]);

  child.stdout.on('data', (data: any) => {
    console.log(`${data}`);
  });

  child.stderr.on('data', (data: any) => {
    if (process.argv.includes('--show-errors')) {
      console.error(`stderr: ${data}`);
    }
  });

  child.on('close', (code: any) => {
    // console.log(`child process exited with code ${code}`);
  });
}

startMPV(youtubeUrl);
getDescription(youtubeUrl);
