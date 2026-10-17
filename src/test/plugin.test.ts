import { describe, it, expect } from 'vitest';
import { PluginManager } from '../core/plugins/pluginManager';
import { PluginInstance } from '../core/domain/plugin';

describe('Plugin Manager & Extension System', () => {
  it('registers and activates a plugin, dispatching commands', async () => {
    const manager = new PluginManager();
    let commandExecuted = false;

    const testPlugin: PluginInstance = {
      manifest: {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        description: 'A test plugin',
        author: 'Tester',
      },
      enabled: false,
      onLoad: context => {
        context.registerCommand({
          id: 'test-cmd',
          title: 'Run Test Command',
          handler: () => {
            commandExecuted = true;
          },
        });
      },
      onUnload: () => {},
    };

    manager.registerPlugin(testPlugin);
    expect(manager.getCommands()).toHaveLength(0);

    // Activate
    const success = await manager.activatePlugin('test-plugin');
    expect(success).toBe(true);

    const commands = manager.getCommands();
    expect(commands).toHaveLength(1);
    expect(commands[0].title).toBe('Run Test Command');

    // Run command
    commands[0].handler();
    expect(commandExecuted).toBe(true);

    // Deactivate
    await manager.deactivatePlugin('test-plugin');
    expect(manager.getCommands()).toHaveLength(0);
  });
});
