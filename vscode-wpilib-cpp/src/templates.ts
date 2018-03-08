'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import { IExampleTemplateAPI, IExampleTemplateCreator } from './shared/externalapi';

interface JsonLayout {
  name: string;
  description: string;
  tags: string[];
}

export class Templates {
  private readonly exampleResourceName = 'cpptemplates.json';

  constructor(resourceRoot: string, core: IExampleTemplateAPI) {
    let resourceFile = path.join(resourceRoot, 'templates', this.exampleResourceName);
    fs.readFile(resourceFile, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let templates: JsonLayout[] = jsonc.parse(data);
      for (let e of templates) {
        let provider: IExampleTemplateCreator = {
          getLanguage(): string {
            return 'cpp';
          },
          getDescription(): string {
            return e.description;
          },
          getDisplayName(): string {
            return e.name;
          },
          async generate(_: vscode.Uri): Promise<boolean> {
            console.log('run generation');
            return true;
          }
        };
        core.addTemplateProvider(provider);
      }
    });
  }

  dispose() {

  }
}