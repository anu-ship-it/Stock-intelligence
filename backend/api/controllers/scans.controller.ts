import { ScanOrchestratorService }
  from '../../services/scan-orchestrator.service';

export class ScansController {

  private scanOrchestratorService =
    new ScanOrchestratorService();

  async run(
    req: any,
    res: any
  ) {

    try {

      const results =
        await this.scanOrchestratorService
          .run();

      res.json({
        success: true,
        results
      });

    } catch (error: any) {

      res.status(500).json({
        success: false,
        error: error.message
      });

    }
  }
}
