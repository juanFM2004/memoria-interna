import { useState } from 'react';

const registerNames = [
  'zero', 'ra', 'sp', 'gp', 'tp', 't0', 't1', 't2', 's0', 's1',
  'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 's2', 's3',
  's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 't3', 't4', 't5', 't6'
];

const programs = [
  {
    id: 'sum',
    title: 'Suma acumulada',
    category: 'BUCLE · MEMORIA',
    summary: 'Suma los enteros del 1 al 5 con un bucle y guarda el total en memoria.',
    goal: 'El resultado esperado es 15.',
    memory: { 0: 0 },
    instructions: [
      { asm: 'addi t0, zero, 1', op: 'addi', rd: 5, rs1: 0, imm: 1, note: 'Inicializa t0 en 1: es el número actual que se va a sumar.' },
      { asm: 'addi t1, zero, 6', op: 'addi', rd: 6, rs1: 0, imm: 6, note: 'Guarda 6 como límite. El bucle termina cuando t0 alcanza este valor.' },
      { asm: 'addi t2, zero, 0', op: 'addi', rd: 7, rs1: 0, imm: 0, note: 'Inicializa el acumulador t2 en cero.' },
      { asm: 'add t2, t2, t0', op: 'add', rd: 7, rs1: 7, rs2: 5, note: 'Acumula el número actual en t2.' , label: 'loop'},
      { asm: 'addi t0, t0, 1', op: 'addi', rd: 5, rs1: 5, imm: 1, note: 'Incrementa el número actual para la siguiente vuelta.' },
      { asm: 'blt t0, t1, loop', op: 'blt', rs1: 5, rs2: 6, target: 3, note: 'Si t0 es menor que el límite, vuelve a la instrucción loop.' },
      { asm: 'sw t2, 0(zero)', op: 'sw', rs1: 0, rs2: 7, imm: 0, note: 'Escribe el total acumulado en la dirección de memoria 0.' },
      { asm: 'add a0, t2, zero', op: 'add', rd: 10, rs1: 7, rs2: 0, note: 'Copia el resultado a a0, registro usado para devolver un valor.' },
      { asm: 'ecall', op: 'ecall', note: 'Finaliza el programa.' }
    ]
  },
  {
    id: 'max',
    title: 'Máximo de dos valores',
    category: 'RAM · CONDICIONAL',
    summary: 'Lee dos enteros de memoria, compara sus valores y almacena el mayor.',
    goal: 'La memoria contiene 7 y 12; el resultado esperado es 12.',
    memory: { 0: 7, 4: 12, 8: 0 },
    instructions: [
      { asm: 'lw t0, 0(zero)', op: 'lw', rd: 5, rs1: 0, imm: 0, note: 'Carga el primer valor desde la dirección 0 de memoria.' },
      { asm: 'lw t1, 4(zero)', op: 'lw', rd: 6, rs1: 0, imm: 4, note: 'Carga el segundo valor desde la dirección 4.' },
      { asm: 'bge t0, t1, keep', op: 'bge', rs1: 5, rs2: 6, target: 4, note: 'Si t0 es mayor o igual que t1, conserva el primer valor y salta.' },
      { asm: 'add t0, t1, zero', op: 'add', rd: 5, rs1: 6, rs2: 0, note: 'Si no se tomó el salto, copia el segundo valor a t0.' },
      { asm: 'sw t0, 8(zero)', op: 'sw', rs1: 0, rs2: 5, imm: 8, note: 'Guarda el valor mayor en la dirección 8.', label: 'keep' },
      { asm: 'add a0, t0, zero', op: 'add', rd: 10, rs1: 5, rs2: 0, note: 'Prepara el máximo en a0 como resultado del programa.' },
      { asm: 'ecall', op: 'ecall', note: 'Finaliza el programa.' }
    ]
  },
  {
    id: 'factorial',
    title: 'Factorial iterativo',
    category: 'BUCLE · ARITMÉTICA',
    summary: 'Calcula 5! multiplicando un acumulador mientras reduce el contador.',
    goal: 'El resultado esperado es 120.',
    memory: { 0: 0 },
    instructions: [
      { asm: 'addi t0, zero, 5', op: 'addi', rd: 5, rs1: 0, imm: 5, note: 'Inicializa el contador en 5.' },
      { asm: 'addi t1, zero, 1', op: 'addi', rd: 6, rs1: 0, imm: 1, note: 'Inicializa el acumulador del factorial en 1.' },
      { asm: 'addi t2, zero, 1', op: 'addi', rd: 7, rs1: 0, imm: 1, note: 'Usa 1 como condición de salida del bucle.' },
      { asm: 'blt t0, t2, done', op: 'blt', rs1: 5, rs2: 7, target: 7, note: 'Si el contador es menor que 1, salta al final.' , label: 'loop'},
      { asm: 'mul t1, t1, t0', op: 'mul', rd: 6, rs1: 6, rs2: 5, note: 'Multiplica el acumulador por el contador actual.' },
      { asm: 'addi t0, t0, -1', op: 'addi', rd: 5, rs1: 5, imm: -1, note: 'Reduce el contador en uno.' },
      { asm: 'j loop', op: 'j', target: 3, note: 'Vuelve a comprobar la condición del bucle.' },
      { asm: 'sw t1, 0(zero)', op: 'sw', rs1: 0, rs2: 6, imm: 0, note: 'Guarda el factorial calculado en memoria.', label: 'done' },
      { asm: 'add a0, t1, zero', op: 'add', rd: 10, rs1: 6, rs2: 0, note: 'Copia el resultado a a0.' },
      { asm: 'ecall', op: 'ecall', note: 'Finaliza el programa.' }
    ]
  }
];

function initialMachine(program) {
  return {
    pc: 0,
    registers: Array(32).fill(0),
    memory: { ...program.memory },
    halted: false,
    steps: 0,
    explanation: 'El programa está listo. Pulsa «Siguiente paso» para ejecutar la primera instrucción.',
    history: []
  };
}

function execute(machine, instruction) {
  const registers = [...machine.registers];
  const memory = { ...machine.memory };
  const left = registers[instruction.rs1] ?? 0;
  const right = registers[instruction.rs2] ?? 0;
  let nextPc = machine.pc + 1;
  let explanation = instruction.note;
  let halted = false;

  switch (instruction.op) {
    case 'addi':
      registers[instruction.rd] = left + instruction.imm;
      explanation += ` Resultado: ${left} + ${instruction.imm} = ${registers[instruction.rd]}.`;
      break;
    case 'add':
      registers[instruction.rd] = left + right;
      explanation += ` Resultado: ${left} + ${right} = ${registers[instruction.rd]}.`;
      break;
    case 'mul':
      registers[instruction.rd] = left * right;
      explanation += ` Resultado: ${left} × ${right} = ${registers[instruction.rd]}.`;
      break;
    case 'lw': {
      const address = left + instruction.imm;
      registers[instruction.rd] = memory[address] ?? 0;
      explanation += ` La dirección ${address} contiene ${registers[instruction.rd]}.`;
      break;
    }
    case 'sw': {
      const address = left + instruction.imm;
      memory[address] = right;
      explanation += ` Se escribió ${right} en la dirección ${address}.`;
      break;
    }
    case 'blt':
      if (left < right) nextPc = instruction.target;
      explanation += ` ${left} ${left < right ? '<' : '≥'} ${right}; ${left < right ? 'se toma' : 'no se toma'} el salto.`;
      break;
    case 'bge':
      if (left >= right) nextPc = instruction.target;
      explanation += ` ${left} ${left >= right ? '≥' : '<'} ${right}; ${left >= right ? 'se toma' : 'no se toma'} el salto.`;
      break;
    case 'bne':
      if (left !== right) nextPc = instruction.target;
      explanation += ` Los valores ${left} y ${right} ${left !== right ? 'son distintos: se toma' : 'son iguales: no se toma'} el salto.`;
      break;
    case 'beq':
      if (left === right) nextPc = instruction.target;
      explanation += ` Los valores ${left} y ${right} ${left === right ? 'son iguales: se toma' : 'son distintos: no se toma'} el salto.`;
      break;
    case 'j':
      nextPc = instruction.target;
      explanation += ` El contador de programa cambia a la instrucción ${nextPc + 1}.`;
      break;
    case 'ecall':
      halted = true;
      explanation += registers[10] ? ` Valor final en a0: ${registers[10]}.` : '';
      break;
    default:
      throw new Error(`Instrucción no implementada: ${instruction.op}`);
  }

  registers[0] = 0;
  return { pc: nextPc, registers, memory, halted, steps: machine.steps + 1, explanation };
}

function advance(machine, program) {
  if (machine.halted || machine.pc >= program.instructions.length) return machine;
  const instruction = program.instructions[machine.pc];
  const next = execute(machine, instruction);
  return { ...next, history: [...machine.history, machine] };
}

function formatValue(value) {
  return `${value} · 0x${(value >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

export default function RiscSimulator() {
  const [selectedId, setSelectedId] = useState(programs[0].id);
  const program = programs.find((item) => item.id === selectedId);
  const [machine, setMachine] = useState(() => initialMachine(programs[0]));
  const currentInstruction = program.instructions[machine.pc];
  const labels = new Map(program.instructions.flatMap((instruction, index) => instruction.label ? [[index, instruction.label]] : []));

  const chooseProgram = (id) => {
    const nextProgram = programs.find((item) => item.id === id);
    setSelectedId(id);
    setMachine(initialMachine(nextProgram));
  };

  const stepForward = () => setMachine((current) => advance(current, program));
  const stepBack = () => setMachine((current) => current.history.length ? current.history[current.history.length - 1] : current);
  const runToEnd = () => setMachine((current) => {
    let next = current;
    let safety = 0;
    while (!next.halted && safety < 500) {
      const advanced = advance(next, program);
      if (advanced === next) break;
      next = advanced;
      safety += 1;
    }
    return next;
  });

  return (
    <div className="risc-page">
      <header className="risc-topbar">
        <a className="risc-brand" href="/" aria-label="Volver a Memory Lab"><span className="risc-brand-mark">M</span><span>MEMORY LAB<small>ARQUITECTURA DE COMPUTADORES</small></span></a>
        <a className="risc-back" href="/">← <span>Volver al laboratorio</span></a>
      </header>

      <main className="risc-main">
        <section className="risc-intro">
          <div className="risc-eyebrow"><span /> LABORATORIO INTERACTIVO <span className="risc-edition">RISC-V · RV32I + MUL</span></div>
          <h1>Entiende cada<br /><em>instrucción.</em></h1>
          <p>Elige un programa, avanza por su código y observa cómo cambian el procesador y la memoria en cada paso.</p>
        </section>

        <section className="risc-programs" aria-label="Seleccionar programa">
          {programs.map((item, index) => (
            <button className={`risc-program-card ${selectedId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => chooseProgram(item.id)} aria-pressed={selectedId === item.id}>
              <span className="risc-program-number">0{index + 1}</span>
              <span className="risc-program-copy"><small>{item.category}</small><strong>{item.title}</strong><span>{item.summary}</span></span>
              <span className="risc-program-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </section>

        <section className="risc-workbench" aria-label={`Simulador: ${program.title}`}>
          <div className="risc-workbench-head">
            <div><span className="risc-section-label">PROGRAMA ACTIVO</span><h2>{program.title}</h2></div>
            <div className={`risc-status ${machine.halted ? 'halted' : 'ready'}`}><i />{machine.halted ? 'FINALIZADO' : 'EN EJECUCIÓN'}</div>
          </div>

          <div className="risc-controls">
            <div className="risc-control-group">
              <button className="risc-icon-button" type="button" onClick={stepBack} disabled={!machine.history.length} aria-label="Paso anterior" title="Paso anterior">←</button>
              <button className="risc-step-button" type="button" onClick={stepForward} disabled={machine.halted} title="Ejecutar una instrucción">Siguiente paso <span>→</span></button>
              <button className="risc-run-button" type="button" onClick={runToEnd} disabled={machine.halted}>Ejecutar todo <span>▶</span></button>
            </div>
            <button className="risc-reset-button" type="button" onClick={() => setMachine(initialMachine(program))}>Reiniciar <span>↺</span></button>
            <div className="risc-counter"><span>PC</span> {(machine.pc * 4).toString().padStart(3, '0')} <i /> PASO {machine.steps}</div>
          </div>

          <div className="risc-explanation" aria-live="polite"><span className="risc-explanation-icon">i</span><p>{machine.explanation}</p></div>

          <div className="risc-workbench-grid">
            <section className="risc-code-panel" aria-label="Código ensamblador">
              <div className="risc-panel-heading"><h3>ENSAMBLADOR</h3><span>RV32 · PALABRAS DE 32 BITS</span></div>
              <div className="risc-code-list">
                {program.instructions.map((instruction, index) => (
                  <div className={`risc-code-row ${machine.pc === index && !machine.halted ? 'current' : ''}`} key={`${program.id}-${index}`}>
                    <span className="risc-code-label">{labels.get(index) ?? ''}</span>
                    <span className="risc-code-address">{(index * 4).toString(16).padStart(4, '0')}</span>
                    <code>{instruction.asm}</code>
                    <span className="risc-code-marker">{machine.pc === index && !machine.halted ? '▶' : ''}</span>
                  </div>
                ))}
              </div>
              <div className="risc-program-goal"><span>OBJETIVO</span><p>{program.goal}</p></div>
            </section>

            <div className="risc-state-column">
              <section className="risc-register-panel" aria-label="Registros del procesador">
                <div className="risc-panel-heading"><h3>REGISTROS</h3><span>32 × 32 BITS</span></div>
                <div className="risc-register-grid">
                  {machine.registers.map((value, index) => (
                    <div className={`risc-register ${currentInstruction?.rd === index && !machine.halted ? 'will-write' : ''}`} key={index}>
                      <span>x{index}<small>{registerNames[index]}</small></span><code>{value}</code>
                    </div>
                  ))}
                </div>
                <p className="risc-register-note">x0 (zero) siempre vale 0. El registro <strong>a0</strong> contiene el resultado.</p>
              </section>

              <section className="risc-memory-panel" aria-label="Memoria de datos">
                <div className="risc-panel-heading"><h3>MEMORIA DE DATOS</h3><span>PALABRAS · 4 BYTES</span></div>
                <div className="risc-memory-table"><div className="risc-memory-head"><span>DIRECCIÓN</span><span>VALOR · DECIMAL / HEX</span></div>
                  {Object.entries(machine.memory).sort(([a], [b]) => Number(a) - Number(b)).map(([address, value]) => (
                    <div className="risc-memory-row" key={address}><code>0x{Number(address).toString(16).toUpperCase().padStart(4, '0')}</code><code>{formatValue(value)}</code></div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <footer className="risc-footer"><span>SUBCONJUNTO DIDÁCTICO RISC-V</span><span>addi · add · mul · lw · sw · blt · bge · beq · bne · j · ecall</span></footer>
      </main>
    </div>
  );
}