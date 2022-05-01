import Plugin from '@goosemod/plugin';
import { patch } from '@goosemod/patcher';
import * as Webpack from '@goosemod/webpack';

const UserPopoutContainer = Webpack.find(x => x?.type?.displayName === 'UserPopoutContainer');
const UserBanner = Webpack.find(x => x.default?.displayName === 'UserBanner')

let database;
(async () => { // Fetch and load DB async
  database = (await (await fetch('https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json')).json()).reduce((acc, x) => { acc[x.uid] = x.img; return acc; }, {})
})();


class Usrbg extends Plugin {
  onImport() {
    this.enqueueUnpatch(patch(UserPopoutContainer, 'type', (_args, res) => {
      res.props.user.banner = 'null'; // ;)
      return res;
    }));

    this.enqueueUnpatch(patch(UserBanner, 'default', ([ { user } ], res) => {
      res.props.style.backgroundImage = 'url("' + database[user.id] + '")';
    }));
  }
}

export default new Usrbg();