import { describe, it, expect } from 'vitest';
import { BUILT_IN_TEMPLATES } from '../core/templates/builtInTemplates';

describe('Built-in Note Templates', () => {
  it('has essential templates defined', () => {
    const ids = BUILT_IN_TEMPLATES.map(t => t.id);
    expect(ids).toContain('tpl-daily');
    expect(ids).toContain('tpl-meeting');
    expect(ids).toContain('tpl-adr');
    expect(ids).toContain('tpl-research');
  });

  it('generates a formatted daily note with date and sections', () => {
    const dailyTpl = BUILT_IN_TEMPLATES.find(t => t.id === 'tpl-daily');
    expect(dailyTpl).toBeDefined();

    const output = dailyTpl!.templateContent({
      title: 'Daily Note - 2026-10-17',
      dateStr: '2026-10-17',
    });

    expect(output).toContain('Daily Note - 2026-10-17');
    expect(output).toContain('Primary Objectives');
    expect(output).toContain('Review & Summary');
  });

  it('generates an Architecture Decision Record with context and outcome', () => {
    const adrTpl = BUILT_IN_TEMPLATES.find(t => t.id === 'tpl-adr');
    expect(adrTpl).toBeDefined();

    const output = adrTpl!.templateContent({
      title: 'Adopt Vitest for Unit Testing',
      dateStr: '2026-10-17',
    });

    expect(output).toContain('ADR: Adopt Vitest for Unit Testing');
    expect(output).toContain('Context & Problem Statement');
    expect(output).toContain('Decision Outcome');
  });
});
