import cheerio from 'cheerio';
import request from 'superagent';
import CommonComponent from './index';
import SuperagentProxy from 'superagent-proxy';
SuperagentProxy(request);
import ProxyController from './proxy';

/**
 * offer职位爬虫
 */
class Reptile extends CommonComponent {
  constructor() {
    super();
    this.rowsData = [];
    this.resultData = [];
    this.header = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
      'Host': 'www.baidu.com',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive'
    };
    this.addressData = [
      // {
      //   "name": "黑龙江",
      //   "data": ["101050100", "101050200", "101050300", "101050400", "101050500", "101050600", "101050700", "101050800", "101050900", "101051000", "101051100", "101051200", "101051300"]
      // },
      // {
      //   "name": "吉林",
      //   "data": ["101060100", "101060200", "101060300", "101060400", "101060500", "101060600", "101060700", "101060800", "101060900"]
      // },
      // {
      //   "name": "辽宁",
      //   "data": ["101070100", "101070200", "101070300", "101070400", "101070500", "101070600", "101070700", "101070800", "101070900", "101071000", "101071100", "101071200", "101071300", "101071400"]
      // }, {
      //   "name": "内蒙古",
      //   "data": ["101080100", "101080200", "101080300", "101080400", "101080500", "101080600", "101080700", "101080800", "101080900", "101081000", "101081100", "101081200"]
      // }, {
      //   "name": "河北",
      //   "data": ["101090100", "101090200", "101090300", "101090400", "101090500", "101090600", "101090700", "101090800", "101090900", "101091000", "101091100"]
      // }, {
      //   "name": "山西",
      //   "data": ["101100100", "101100200", "101100300", "101100400", "101100500", "101100600", "101100700", "101100800", "101100900", "101101000", "101101100"]
      // },
      // {
      //   "name": "陕西",
      //   "data": ["101110100", "101110200", "101110300", "101110400", "101110500", "101110600", "101110700", "101110800", "101110900", "101111000"]
      // }, {
      //   "name": "山东",
      //   "data": ["101120100", "101120200", "101120300", "101120400", "101120500", "101120600", "101120700", "101120800", "101120900", "101121000", "101121100", "101121200", "101121300", "101121400", "101121500", "101121600", "101121700"]
      // }, {
      //   "name": "新疆",
      //   "data": ["101130100", "101130200", "101130300", "101130400", "101130500", "101130600", "101130800", "101130900", "101131000", "101131100", "101131200", "101131300", "101131400", "101131500", "101131600", "101131700", "101131800", "101131900", "101132000", "101132100", "101132200", "101132300", "101132400"]
      // }, {
      //   "name": "青海",
      //   "data": ["101150100", "101150200", "101150300", "101150400", "101150500", "101150600", "101150700", "101150800"]
      // }, {
      //   "name": "甘肃",
      //   "data": ["101160100", "101160200", "101160300", "101160400", "101160500", "101160600", "101160700", "101160800", "101160900", "101161000", "101161100", "101161200", "101161300", "101161400"]
      // }, {
      //   "name": "宁夏",
      //   "data": ["101170100", "101170200", "101170300", "101170400", "101170500"]
      // }, {
      //   "name": "河南",
      //   "data": ["101180100", "101180200", "101180300", "101180400", "101180500", "101180600", "101180700", "101180800", "101180900", "101181000", "101181100", "101181200", "101181300", "101181400", "101181500", "101181600", "101181700", "101181800"]
      // }, {
      //   "name": "江苏",
      //   "data": ["101190100", "101190200", "101190300", "101190400", "101190500", "101190600", "101190700", "101190800", "101190900", "101191000", "101191100", "101191200", "101191300"]
      // }, {
      //   "name": "湖北",
      //   "data": ["101200100", "101200200", "101200300", "101200400", "101200500", "101200600", "101200700", "101200800", "101200900", "101201000", "101201100", "101201200", "101201300", "101201400", "101201500", "101201600", "101201700"]
      // }, {
      //   "name": "浙江",
      //   "data": ["101210100", "101210200", "101210300", "101210400", "101210500", "101210600", "101210700", "101210800", "101210900", "101211000", "101211100"]
      // }, {
      //   "name": "安徽",
      //   "data": ["101220100", "101220200", "101220300", "101220400", "101220500", "101220600", "101220700", "101220800", "101220900", "101221000", "101221100", "101221200", "101221300", "101221400", "101221500", "101221600"]
      // }, {
      //   "name": "福建",
      //   "data": ["101230100", "101230200", "101230300", "101230400", "101230500", "101230600", "101230700", "101230800", "101230900"]
      // }, {
      //   "name": "江西",
      //   "data": ["101240100", "101240200", "101240300", "101240400", "101240500", "101240600", "101240700", "101240800", "101240900", "101241000", "101241100"]
      // }, {
      //   "name": "湖南",
      //   "data": ["101250100", "101250200", "101250300", "101250400", "101250500", "101250600", "101250700", "101250800", "101250900", "101251000", "101251100", "101251200", "101251300", "101251400"]
      // }, {
      //   "name": "贵州",
      //   "data": ["101260100", "101260200", "101260300", "101260400", "101260500", "101260600", "101260700", "101260800", "101260900"]
      // }, {
      //   "name": "四川",
      //   "data": ["101270100", "101270200", "101270300", "101270400", "101270500", "101270600", "101270700", "101270800", "101270900", "101271000", "101271100", "101271200", "101271300", "101271400", "101271500", "101271600", "101271700", "101271800", "101271900", "101272000", "101272100"]
      // },
      // {
      //   "name": "广东",
      //   "data": ["101280100", "101280200", "101280300", "101280400", "101280500", "101280600", "101280700", "101280800", "101280900", "101281000", "101281100", "101281200", "101281300", "101281400", "101281500", "101281600", "101281700", "101281800", "101281900", "101282000", "101282100", "101282200"]
      // },
      // {
      //   "name": "云南",
      //   "data": ["101290100", "101290200", "101290300", "101290400", "101290500", "101290700", "101290800", "101290900", "101291000", "101291100", "101291200", "101291300", "101291400", "101291500", "101291600", "101291700"]
      // }, {
      //   "name": "广西",
      //   "data": ["101300100", "101300200", "101300300", "101300400", "101300500", "101300600", "101300700", "101300800", "101300900", "101301000", "101301100", "101301200", "101301300", "101301400"]
      // }, {
      //   "name": "海南",
      //   "data": ["101310100", "101310200", "101310300", "101310400", "101310500", "101310600", "101310700", "101310800", "101310900", "101311000", "101311100", "101311200", "101311300", "101311400", "101311500", "101311600", "101311700", "101311800", "101311900"]
      // }, {
      //   "name": "台湾",
      //   "data": ["101341100"]
      // }, {
      //   "name": "西藏",
      //   "data": ["101140100", "101140200", "101140300", "101140400", "101140500", "101140600", "101140700"]
      // }, {
      //   "name": "香港",
      //   "data": ["101320300"]
      // }, {
      //   "name": "澳门",
      //   "data": ["101330100"]
      // },
      // {
      //   "name": "北京",
      //   "data": ["101010100"]
      // },
      {
        "name": "上海",
        "data": ["101020100"]
      }, {
        "name": "天津",
        "data": ["101030100"]
      }
    ];
  }
  /**
   * 获取全国的某职位数据信息
   */
  async getAllOfferData() {
    return new Promise(resolve => {
      let currentIndex = 0;
      const recursive = () => {
        if (currentIndex >= this.addressData.length) {
          console.log('promise resolve all result recursive resultData length', this.resultData.length)
          return resolve(this.resultData);
        }
        const currentItem = this.addressData[currentIndex];
        let index = 0;
        const resultData = async () => {
          return new Promise(async resolve => {
            const _data = async (_page_index) => {
              this.getCityOfferData(currentItem.name, currentItem.data[index], _page_index).then(result_data => {
                if (Array.isArray(result_data)) {
                  return resolve(result_data);
                }
              }).catch(async (p_index) => {
                console.log('request error,change proxy ip tryagain')
                return _data(p_index);
              });
            };
            _data();
          })
        }
        const recursive2 = async () => {
          if (index >= currentItem.data.length) {
            index = 0;
            currentIndex += 1;
            if (currentIndex < this.addressData.length) {
              console.log(`${currentItem.name} ${currentItem.data[index]} reptile success-next province reptile`);
            }
            recursive();
            return false;
          } else {
            const _data = await resultData();
            this.resultData = _data && this.resultData.concat(_data);
            this.rowsData = [];
            console.log(`${currentItem.name}[${currentItem.data[index]}] reptile success-next city reptile emaining:${currentItem.data.length - index}`);
            index += 1;
            await this.sleep(1500);
            recursive2();
          }
        }
        recursive2();
      }
      recursive();
    })
  }
  /**
   * 递归获取某个地区的所有职位数据
   */
  async getCityOfferData(attribution, cityCode, pageIndex = 1) {
    return new Promise(async (resolve, reject) => {
      const recursive = async () => {
        const baseUrl = `https://www.zhipin.com/c101010100-p100901/?ka=sel-city-${cityCode}&page=${pageIndex}&ka=page-${pageIndex}`;
        const proxy_ip = await this.getProxy();
        let proxy = `http://${proxy_ip}`;
        console.log('currentUrl:', baseUrl, 'proxy_ip', proxy_ip);
        if (!proxy_ip) { // 若无可用ip,则更新
          await ProxyController.initTable();
          proxy = `http://${await this.getProxy()}`;
        };
        await request.get(baseUrl)
          .set('header', this.header)
          .proxy(proxy)
          .timeout(15000)
          .end(async (error, response) => {
            if (error) {
              console.log('reject')
              return reject(pageIndex);
            } else {
              if (!response.text) {
                return reject()
              };
              const $ = cheerio.load(response.text, {
                decodeEntities: false
              });
              if (
                // pageIndex <= 2
                !$('.home-inner .page').find('.next').hasClass('disabled')
              ) {
                console.log(`============start reptile [${pageIndex}] page===================`)
                const jobList = $('.job-box .job-list ul').find('li');
                let job_index = 0;
                const job_recursive = async () => {
                  console.log('now current count：', job_index, 'totalCount:', jobList.length)
                  const el = $(jobList[job_index]);
                  const salary = el.find('.info-primary .name .job-title').siblings('span').text().split('-'); // 薪资待遇
                  const job_info = el.find('.job-primary .info-primary p').html().replace(/<em class="vline"><\/em>/g, '$%').split('$%');
                  const job_company = el.find('.job-primary .info-company .company-text p').html().replace(/<em class="vline"><\/em>/g, '$%').split('$%');
                  const detail_url = el.find('.job-primary .info-primary .name').find('a').attr('data-jid');
                  const offer = {
                    jobId: detail_url,
                    name: el.find('.info-primary .name .job-title').text(), // 职位名称
                    companyName: el.find('.info-company .company-text .name').find('a').text(), // 公司名称
                    minSalary: salary[0], // 薪资待遇
                    maxSalary: salary[1], // 薪资待遇
                    education: job_info[2], // 学历要求
                    experience: job_info[1], // 工作经验
                    industry: job_company[0], // 行业类型
                    financing: job_company[1], // 融资情况
                    companySize: job_company[2], // 公司人数
                    province: '',
                    city: '',
                    area: '',
                  };
                  try {
                    let address = job_info[0].trim().split(' ');
                    address.forEach((i, k) => {
                      switch (k) {
                        case 0:
                          offer.province = i;
                          break;
                        case 1:
                          offer.city = i;
                          break;
                        case 2:
                          offer.area = i;
                          break;
                        default:
                          break;
                      }
                    });
                    offer.attribution = attribution ? attribution : offer.province;
                  } catch (error) {}
                  if (this.rowsData.map(k => (k.jobId)).includes(offer.jobId) || this.resultData.map(k => (k.jobId)).includes(offer.jobId)) { // 过滤重复数据
                    if (job_index >= jobList.length) {
                      console.log(`============[${pageIndex}] page reptile success================`);
                      pageIndex = pageIndex + 1;
                      await this.sleep(1500);
                      return recursive(); // 1秒抓取一次，抓取速度过快会导致ip被封禁
                    }
                    console.log('duplicates offer skip 1');
                    job_index = job_index + 1;
                    return job_recursive();
                  };
                  console.log('sleep 500');
                  await this.sleep(500); // 延迟500ms
                  console.log('get detail_url padding...');
                  await request.get(`https://www.zhipin.com/view/job/card.json?jid=${detail_url}&lid=1bCGA8JSMOY.search`)
                    .set('header', this.header)
                    .proxy(proxy)
                    .timeout(15000)
                    .end(async (er, detail) => {
                      console.log('get detail_url resolve...')
                      let description;
                      try {
                        description = !er && detail.body.html ? detail.body.html.match(/(?<=<div class=.detail-bottom-text.>)[\s\S]+?(?=<\/div>)/)[0].replace(/\s*/g, '').toLowerCase() : null;
                      } catch (error) {
                        description = !er && detail.body.html ? detail.body.html.toLowerCase() : null;
                      }
                      const result = {
                        ...offer,
                        description,
                      };
                      if (job_index >= jobList.length) {
                        console.log(`============[${pageIndex}] page reptile success================`);
                        pageIndex = pageIndex + 1;
                        await this.sleep(1500);
                        recursive(); // 1.5秒抓取一次，抓取速度过快会导致ip被封禁
                      } else {
                        job_index = job_index + 1;
                        this.rowsData.push(result)
                        job_recursive();
                      }
                    });
                };
                if (!jobList || jobList.length <= 0) {
                  console.log('jobList length is null, please check if your IP is banned');
                  console.log(`============try request [${pageIndex}] page reptile...================`);
                  pageIndex = pageIndex + 1;
                  await this.sleep(1500);
                  recursive(); // 1.5秒抓取一次，抓取速度过快会导致ip被封禁
                } else {
                  job_recursive();
                }
              } else {
                console.log('callback all resolve now rows length: ', this.rowsData.length);
                const resultData = this.rowsData.map(i => {
                  return Object.assign(i, {
                    maxSalary: Number(i.maxSalary.replace(/k/g, '')),
                    minSalary: Number(i.minSalary.replace(/k/g, '')),
                  })
                });
                return resolve(resultData);
              }
            }
          })
      };
      recursive();
    })
  }
}


export default new Reptile();