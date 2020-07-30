import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class FakeEmailTemplateProvider
  implements IMailTemplateProvider {
  public async parse({ file }: IParseMailTemplateDTO): Promise<string> {
    return file;
  }
}
