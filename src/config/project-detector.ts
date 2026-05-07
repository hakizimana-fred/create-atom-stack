import fs from 'fs';
import path from 'path';
import type { SupportedStateManagement } from '../types/generator.js';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readPackageJson(cwd: string): PackageJson | null {
  const p = path.join(cwd, 'package.json');
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) as PackageJson; }
  catch { return null; }
}

function allDeps(pkg: PackageJson): Set<string> {
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
}

/** Detect state management from installed packages. Returns null when nothing found. */
export function detectStateManagement(cwd = process.cwd()): SupportedStateManagement | null {
  const pkg = readPackageJson(cwd);
  if (!pkg) return null;
  const deps = allDeps(pkg);
  if (deps.has('zustand'))           return 'zustand';
  if (deps.has('@reduxjs/toolkit'))  return 'redux-toolkit';
  if (deps.has('jotai'))             return 'jotai';
  if (deps.has('mobx'))              return 'mobx';
  return null;
}

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/** Detect the package manager from lockfiles / package.json#packageManager. */
export function detectPackageManager(cwd = process.cwd()): PackageManager {
  if (
    fs.existsSync(path.join(cwd, 'bun.lock')) ||
    fs.existsSync(path.join(cwd, 'bun.lockb'))
  ) return 'bun';
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock')))       return 'yarn';

  // Honour the corepack field when present
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8')) as { packageManager?: string };
    if (pkg.packageManager?.startsWith('pnpm')) return 'pnpm';
    if (pkg.packageManager?.startsWith('yarn')) return 'yarn';
    if (pkg.packageManager?.startsWith('bun'))  return 'bun';
  } catch { /* ignore */ }

  return 'npm';
}

/** Returns true when zod is installed in the project. */
export function detectZod(cwd = process.cwd()): boolean {
  const pkg = readPackageJson(cwd);
  if (!pkg) return false;
  return allDeps(pkg).has('zod');
}

/** Returns 'app' | 'pages' by inspecting the directory tree. */
export function detectRouter(cwd = process.cwd()): 'app' | 'pages' | null {
  if (fs.existsSync(path.join(cwd, 'src', 'app')))   return 'app';
  if (fs.existsSync(path.join(cwd, 'app')))           return 'app';
  if (fs.existsSync(path.join(cwd, 'src', 'pages'))) return 'pages';
  if (fs.existsSync(path.join(cwd, 'pages')))        return 'pages';
  return null;
}
