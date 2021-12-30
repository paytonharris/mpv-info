import { spawn } from 'child_process';
import ytcm from '@freetube/yt-comment-scraper';
import url from 'url';

interface Comment {
  authorThumb: any[];
  author: string;
  authorId: string;
  commentId: string;
  text: string;
  likes: string;
  numReplies: number;
  isOwner: boolean;
  isHearted: boolean;
  isPinned: boolean;
  hasOwnerReplied: boolean;
  time: string;
  edited: boolean;
  replyToken: string;
  isVerified: boolean;
  isOfficialArtist: boolean;
}

interface CommentObject {
  comments: Comment[]
}

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
  const args = ['--skip-download', '--get-description', url];

  const child = spawn(command, args);

  child.stdout.on('data', (data: any) => {
    console.log('\n\n############### start description ###############')
    console.log(`${data}`);
    console.log('############### end description ###############\n\n')
  });

  child.stderr.on('data', (data: any) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code: any) => {
    // console.log(`child process exited with code ${code}`);
  });
}

const printComments = (comments: CommentObject) => {
  console.log('\n\n~~~~~~~~~~~~~~~start comments~~~~~~~~~~~~~~~')

  comments.comments.forEach((comment, commentIndex) => {
    console.log(`[${comment.likes}]${comment.isHearted ? '♥' : ''}${comment.isOwner ? ' (owner)' : ''}${comment.isPinned ? ' (pinned)' : ''}`)
    console.log(`\t${comment.text}`)

    // add a separator between every comment, but not at the end.
    if (commentIndex !== (comments.comments.length - 1)) {
      console.log('----------------------------')
    }
  });

  console.log('~~~~~~~~~~~~~~~end comments~~~~~~~~~~~~~~~\n\n')
}

const getComments = (videoUrl: string) => {

  // get the youtube video ID from the videoUrl.
  // since videoUrl could be a full url or just the code, we parse
  // the string as a url if it's over 11 characters
  var id: string | undefined = videoUrl;
  if (videoUrl.length !== 11) { // 11 is length of all youtube video ids
    const parsedVideoId = url.parse(videoUrl, true).query?.v;

    if (typeof parsedVideoId !== 'string') {
      console.log("[Comment parser] Could not get video ID from input");
      return;
    } else {
      id = parsedVideoId
    }
  }

  // get the youtube comments using ytcm
  if (typeof id === 'string') {
    ytcm.getComments({ videoId: id }).then((data: any) => {
      printComments(data)
    }).catch((error: any) => {
      console.error(error);
    });
  }
}

if (!process.argv.includes('--no-video')) {
  startMPV(youtubeUrl);
}
if (!process.argv.includes('--no-desc')) {
  getDescription(youtubeUrl);
}
if (!process.argv.includes('--no-comments')) {
  getComments(youtubeUrl);
}
