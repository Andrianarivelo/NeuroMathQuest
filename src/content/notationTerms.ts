import { Lesson, NotationTerm } from './types';

function addTerm(terms: NotationTerm[], symbol: string, meaning: string) {
  if (!terms.some((term) => term.symbol === symbol)) {
    terms.push({ symbol, meaning });
  }
}

function hasSymbol(notation: string, symbol: string) {
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}(?=[^A-Za-z0-9_]|$)`).test(notation);
}

export function getNotationTerms(lesson: Lesson): NotationTerm[] {
  if (lesson.notationTerms) return lesson.notationTerms;
  if (!lesson.notation) return [];

  const notation = lesson.notation;
  const terms: NotationTerm[] = [];

  if (notation.includes('V_rest')) addTerm(terms, 'V_rest', 'resting membrane potential');
  if (notation.includes('V_th')) addTerm(terms, 'V_th', 'spike threshold voltage');
  if (notation.includes('V_reset')) addTerm(terms, 'V_reset', 'voltage after a spike reset');
  if (notation.includes('V ') || notation.includes('dV') || notation.includes('(V')) {
    addTerm(terms, 'V', 'membrane voltage or system value');
  }
  if (notation.includes('mV')) addTerm(terms, 'mV', 'millivolts, a unit of voltage');
  if (notation.includes('I_syn')) addTerm(terms, 'I_syn', 'synaptic current');
  if (notation.includes('g_syn')) addTerm(terms, 'g_syn', 'synaptic conductance');
  if (notation.includes('E_syn')) addTerm(terms, 'E_syn', 'synaptic reversal potential');
  if (notation.includes('g_Na')) addTerm(terms, 'g_Na', 'sodium-channel conductance');
  if (notation.includes('g_K')) addTerm(terms, 'g_K', 'potassium-channel conductance');
  if (notation.includes('g_L')) addTerm(terms, 'g_L', 'leak conductance');
  if (notation.includes('E_Na')) addTerm(terms, 'E_Na', 'sodium reversal potential');
  if (notation.includes('E_K')) addTerm(terms, 'E_K', 'potassium reversal potential');
  if (notation.includes('E_L')) addTerm(terms, 'E_L', 'leak reversal potential');
  if (notation.includes('I(t)') || notation.endsWith('+ I') || notation.includes('+ I;')) {
    addTerm(terms, 'I', 'input current or drive');
  }
  if (notation.includes('I = g')) addTerm(terms, 'I', 'current through a channel');
  if (notation.includes('g (') || notation.includes('g_syn')) addTerm(terms, 'g', 'conductance, how open a channel is');
  if (notation.includes('τ')) addTerm(terms, 'τ', 'time constant controlling speed of change');
  if (notation.includes('R × C')) addTerm(terms, 'R', 'membrane resistance');
  if (notation.includes('R × C') || notation.includes('C dV')) addTerm(terms, 'C', 'membrane capacitance');
  if (notation.includes('λ²')) addTerm(terms, 'λ', 'length constant for voltage spread');

  if (hasSymbol(notation, 'W') || notation.includes('W_{ij}')) {
    addTerm(terms, 'W', 'weight or connectivity matrix');
  }
  if (notation.includes('W_{ij}')) addTerm(terms, 'W_ij', 'connection strength from unit j to unit i');
  if (notation.includes('wᵢ') || notation.includes('w·') || notation.includes('‖w‖') || notation.includes('∂L/∂w')) {
    addTerm(terms, 'w', 'learned weight parameter');
  }
  if (hasSymbol(notation, 'b')) addTerm(terms, 'b', 'bias term added to a model');
  if (hasSymbol(notation, 'x')) addTerm(terms, 'x', 'input, state, or observed data value');
  if (hasSymbol(notation, 'y')) addTerm(terms, 'y', 'output, target label, or transformed value');
  if (notation.includes('ŷ') || notation.includes('ŷ')) addTerm(terms, 'ŷ', 'model prediction');
  if (hasSymbol(notation, 'u')) addTerm(terms, 'u', 'combined input or vector being projected onto');
  if (hasSymbol(notation, 'v')) addTerm(terms, 'v', 'vector or direction');
  if (hasSymbol(notation, 'r') && !notation.includes('reward')) {
    addTerm(terms, 'r', 'firing rate, response, or reward depending on context');
  }
  if (notation.includes('h_t')) addTerm(terms, 'h_t', 'hidden state at time t');
  if (notation.includes('h =')) addTerm(terms, 'h', 'hidden activity after a layer');
  if (notation.includes('f(') || notation.includes('f:')) addTerm(terms, 'f', 'function or nonlinearity');
  if (notation.includes('σ(')) addTerm(terms, 'σ', 'sigmoid nonlinearity');

  if (notation.includes('Σ')) addTerm(terms, 'Σ', 'sum across the indexed terms');
  if (notation.includes('∫')) addTerm(terms, '∫', 'accumulation across a continuous interval');
  if (notation.includes('∂')) addTerm(terms, '∂', 'partial derivative with one variable changed');
  if (notation.includes('∇')) addTerm(terms, '∇', 'gradient, the direction of steepest increase');
  if (notation.includes('η')) addTerm(terms, 'η', 'learning rate or step size');
  if (notation.includes('θ')) addTerm(terms, 'θ', 'angle or model parameter');
  if (notation.includes('μ')) addTerm(terms, 'μ', 'mean or drift');
  if (notation.includes('σ²')) addTerm(terms, 'σ²', 'variance');
  else if (notation.includes('σ dW')) addTerm(terms, 'σ', 'noise scale');

  if (notation.includes('P(') || notation.includes('~ P')) addTerm(terms, 'P', 'probability');
  if (notation.includes('E[')) addTerm(terms, 'E[...]', 'expected value or average');
  if (notation.includes('Var')) addTerm(terms, 'Var', 'variance, the spread of a random variable');
  if (notation.includes('cov')) addTerm(terms, 'cov', 'covariance, how two variables move together');
  if (notation.includes('Poisson')) addTerm(terms, 'λ', 'average event rate');
  if (notation.includes('N(μ')) addTerm(terms, 'N(μ, σ²)', 'Gaussian distribution with mean and variance');
  if (notation.includes('H(')) addTerm(terms, 'H', 'entropy, uncertainty in a variable');
  if (notation.includes('I(X; Y)')) addTerm(terms, 'I(X; Y)', 'mutual information shared by X and Y');

  if (notation.includes('A v = λ v')) {
    addTerm(terms, 'A', 'matrix transformation');
    addTerm(terms, 'λ', 'eigenvalue, the stretch factor');
  }
  if (notation.includes('A = U Σ V')) {
    addTerm(terms, 'U, V', 'orthogonal direction matrices');
    addTerm(terms, 'Σ', 'singular values, ordered strengths');
  }
  if (notation.includes('Q(s, a)')) {
    addTerm(terms, 'Q(s, a)', 'value of taking action a in state s');
    addTerm(terms, 'α', 'learning-rate step size');
    addTerm(terms, 'γ', 'discount for future value');
    addTerm(terms, 'r', 'reward received');
  }
  if (notation.includes('δ =')) {
    addTerm(terms, 'δ', 'prediction error');
    addTerm(terms, 'γ', 'discount for future value');
  }
  if (notation.includes('Attention(')) {
    addTerm(terms, 'Q', 'queries: what each token is looking for');
    addTerm(terms, 'K', 'keys: what each token offers for matching');
    addTerm(terms, 'V', 'values: information mixed by attention');
    addTerm(terms, 'd', 'key dimension used for scaling');
  }
  if (notation.includes('STA')) {
    addTerm(terms, 'STA', 'spike-triggered average');
    addTerm(terms, 's(t)', 'stimulus at time t');
    addTerm(terms, 'N', 'number of spikes averaged');
  }
  if (notation.includes('F =')) {
    addTerm(terms, 'F', 'Fano factor');
    addTerm(terms, 'N', 'spike count in a time window');
  }
  if (notation.includes('softmax')) addTerm(terms, 'softmax', 'normalizes scores into weights that sum to one');
  if (notation.includes('loss')) addTerm(terms, 'loss', 'error score minimized during training');
  if (notation.includes('MSE')) addTerm(terms, 'MSE', 'mean squared error');
  if (notation.includes('CE')) addTerm(terms, 'CE', 'cross-entropy classification loss');
  if (notation.includes('D =')) addTerm(terms, 'D', 'dataset of input-output examples');
  if (notation.includes('L(w)')) addTerm(terms, 'L(w)', 'loss as a function of weights');

  return terms;
}
