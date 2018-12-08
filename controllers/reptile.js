import cheerio from 'cheerio';
import request from 'superagent';
import CommonComponent from './index';
import SuperagentProxy from 'superagent-proxy';
SuperagentProxy(request);
import ProxyController from './proxy';
import { provinceCode as addressData } from '../common/addressData';

/**
 * offer职位爬虫
 */
class Reptile extends CommonComponent {
  constructor() {
    super();
    this.rowsData = [];
    this.resultData = [];
    this.jobType = {};
    this.header = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
      'Host': 'www.baidu.com',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive'
    };
    this.addressData = addressData;
  }
  /**
   * 获取全国的某职位数据信息
   */
  async getAllJobData(_job) {
    return new Promise(resolve => {
      let currentIndex = 0;
      this.jobType = _job;
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
              this.getCityJobData(currentItem.data[index], _page_index).then(result_data => {
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
            await this.sleep(100);
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
  async getCityJobData(cityCode, pageIndex = 1) {
    return new Promise(async (resolve, reject) => {
      const recursive = async () => {
        const baseUrl = `https://www.zhipin.com${this.jobType.jobTypeCode}?ka=sel-city-${cityCode}&page=${pageIndex}&ka=page-${pageIndex}`;
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
          .timeout(6000)
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
                  const job = {
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
                    ...this.jobType,
                  };
                  try {
                    let address = job_info[0].trim().split(' ');
                    address.forEach((i, k) => {
                      switch (k) {
                        case 0:
                          job.province = i;
                          break;
                        case 1:
                          job.city = i;
                          break;
                        case 2:
                          job.area = i;
                          break;
                        default:
                          break;
                      }
                    });
                  } catch (error) {}
                  if (this.rowsData.map(k => (k.jobId)).includes(job.jobId) || this.resultData.map(k => (k.jobId)).includes(job.jobId)) { // 过滤重复数据
                    if (job_index >= jobList.length) {
                      console.log(`============[${pageIndex}] page reptile success================`);
                      pageIndex = pageIndex + 1;
                      await this.sleep(100);
                      return recursive(); // 1秒抓取一次，抓取速度过快会导致ip被封禁
                    }
                    console.log('duplicates job skip 1');
                    job_index = job_index + 1;
                    return job_recursive();
                  };
                  console.log('sleep 100');
                  await this.sleep(100); // 延迟100ms
                  console.log('get detail_url padding...');
                  await request.get(`https://www.zhipin.com/view/job/card.json?jid=${detail_url}&lid=1bCGA8JSMOY.search`)
                    .set('header', this.header)
                    .proxy(proxy)
                    .timeout(6000)
                    .end(async (er, detail) => {
                      console.log('get detail_url resolve...')
                      let description;
                      try {
                        description = !er && detail.body.html ? detail.body.html.match(/(?<=<div class=.detail-bottom-text.>)[\s\S]+?(?=<\/div>)/)[0].replace(/\s*/g, '').toLowerCase() : null;
                      } catch (error) {
                        description = !er && detail.body.html ? detail.body.html.toLowerCase() : null;
                      }
                      const result = {
                        ...job,
                        description,
                      };
                      if (job_index >= jobList.length) {
                        console.log(`============[${pageIndex}] page reptile success================`);
                        pageIndex = pageIndex + 1;
                        await this.sleep(100);
                        recursive(); // 100ms抓取一次，抓取速度过快会导致ip被封禁
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
                  await this.sleep(100);
                  recursive(); // 100ms秒抓取一次，抓取速度过快会导致ip被封禁
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