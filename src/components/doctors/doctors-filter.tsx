'use client';

import * as React from 'react';

import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  name: string;
}

interface DoctorFilterProps {
  title: string;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
}

export function DoctorFilter({
  title,
  options,
  selectedIds,
  onChange,
  isLoading,
}: DoctorFilterProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCount = selectedIds.length;

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='h-10 border-dashed justify-between min-w-[160px]'
          disabled={isLoading}
        >
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>{title}</span>
            {selectedCount > 0 && (
              <>
                <Separator orientation='vertical' className='h-4' />
                <Badge
                  variant='secondary'
                  className='rounded-sm px-1 font-normal lg:hidden'
                >
                  {selectedCount}
                </Badge>
                <div className='hidden lg:flex gap-1'>
                  {selectedIds.length > 2 ? (
                    <Badge
                      variant='secondary'
                      className='rounded-sm px-1 font-normal'
                    >
                      {selectedCount} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedIds.includes(option.id))
                      .map((option) => (
                        <Badge
                          variant='secondary'
                          key={option.id}
                          className='rounded-sm px-1 font-normal'
                        >
                          {option.name}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </div>

          <div className='flex items-center gap-1 opacity-50'>
            {selectedCount > 0 && (
              <div
                role='button'
                tabIndex={0}
                onClick={handleClear}
                className='hover:bg-accent rounded-sm p-0.5'
              >
                <X className='h-3 w-3' />
              </div>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0' />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align='start'>
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className='h-[200px]'>
                {options.map((option) => {
                  const isSelected = selectedIds.includes(option.id);
                  return (
                    <CommandItem
                      key={option.id}
                      onSelect={() => handleSelect(option.id)}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary ![&_svg]:text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check
                          className={cn('size-3.5 text-primary-foreground')}
                        />
                      </div>
                      <span>{option.name}</span>
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            </CommandGroup>
            {selectedCount > 0 && (
              <>
                <Separator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className='justify-center text-center cursor-pointer'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
