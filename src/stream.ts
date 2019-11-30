import { isNodeJs } from './utils';
import * as stream from 'stream';

/**
 * Simple writable buffer stream
 * @docs: https://nodejs.org/api/stream.html#stream_writable_streams
 */
export class CustomWritableStream extends stream.Writable {
  private _chunks = [];
  private _length = 0;
  public constructor(options?) {
    super(options);
  }

  public _write(chunk, enc, callback): void {
    if (isNodeJs) {
      if (!(chunk instanceof Uint8Array)) chunk = new Uint8Array(chunk);
    }

    this._length += chunk.length;
    this._chunks.push(chunk);
    return callback(null);
  }

  public _destroy(err, callback): void {
    this._chunks = null;
    return callback(null);
  }

  public toBuffer(): Buffer {
    return Buffer.concat(this._chunks);
  }

  public toBlob(): Blob {
    return new Blob(this._chunks, {
      type: 'application/pdf',
    });
  }
}
