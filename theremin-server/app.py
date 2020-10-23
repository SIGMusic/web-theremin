#!/usr/bin/env python3.6
import argparse
import sys

from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/ping', methods=['GET'])
def solve():
  '''
  Returns 'pong'.

  Query Parameters: None

  Returns (JSON):
    {
      text: 'pong'
    }
  '''
  response = {
    'text': 'pong',
  }
  return jsonify(report)


def main(args):
  app.run(
    debug=args.debug,
    host='0.0.0.0',
    port=args.port,
  )


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--debug', action='store_true')
  parser.add_argument('--port', type=int, default=5000)
  args = parser.parse_args()
  sys.exit(main(args))
